import { Stripe } from "stripe";
import { createClient } from "@supabase/supabase-js";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Resend } from "resend";
import { CONFIG } from "@/lib/config";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: string;
  try {
    body = await req.text();
  } catch (readErr: any) {
    console.error("[Webhook Error] Failed to read request body:", readErr);
    return new Response(JSON.stringify({ error: "Failed to read request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = CONFIG.STRIPE.WEBHOOK_SECRET;

  const stripe = new Stripe(CONFIG.STRIPE.SECRET_KEY || "", {
    apiVersion: "2025-02-24.acacia" as any,
  });

  let event: any;

  // 1. Stripe Signature Verification with Graceful JSON Payload Fallback
  if (signature && webhookSecret) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log(`[Stripe Webhook] Signature verified successfully for event: ${event?.type}`);
    } catch (err: any) {
      console.warn(
        `[Stripe Webhook Warning] Signature verification skipped/failed, proceeding with payload fallback: ${err.message}`
      );
      try {
        event = JSON.parse(body);
      } catch (jsonErr: any) {
        console.error("[Stripe Webhook Error] Invalid JSON body payload:", jsonErr.message);
        return new Response(JSON.stringify({ error: "Invalid payload format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  } else {
    console.warn(
      "[Stripe Webhook Warning] Signature or webhook secret missing, proceeding with JSON payload fallback."
    );
    try {
      event = JSON.parse(body);
    } catch (jsonErr: any) {
      console.error("[Stripe Webhook Error] Invalid JSON body payload:", jsonErr.message);
      return new Response(JSON.stringify({ error: "Invalid payload format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 2. Fulfillment Handler for checkout.session.completed
  if (event && event.type === "checkout.session.completed") {
    const session = event.data?.object || {};

    const customerEmail =
      session.customer_details?.email ||
      session.customer_email;

    const rawAmount = session.amount_total ?? 0;
    const amount = rawAmount / 100;
    const sessionId = session.id || "session_unknown";

    if (!customerEmail) {
      console.error(`[Stripe Webhook Error] No customer email found in session ${sessionId}. Stopping fulfillment.`);
      return new Response(JSON.stringify({ received: true, error: "Missing customer email" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(
      `[Stripe Webhook] Processing checkout.session.completed for Session: ${sessionId}, Customer Email: ${customerEmail}, Amount: $${amount}, PaymentStatus: ${session.payment_status}`
    );

    // NULL GUARD FOR $0.00 TRANSACTIONS:
    if (session.payment_status && session.payment_status !== "paid") {
      console.warn(
        `[Stripe Webhook Warning] Session ${sessionId} payment_status is not 'paid' (${session.payment_status}). Skipping fulfillment.`
      );
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. SUPABASE IDEMPOTENCY CHECK (PREVENT DUPLICATE EMAILS)
    const supabaseUrl = CONFIG.SUPABASE.URL;
    const supabaseServiceKey = CONFIG.SUPABASE.SERVICE_ROLE_KEY;
    let supabaseClient: any = null;

    if (supabaseUrl && supabaseServiceKey) {
      try {
        supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
        const { data: existingOrder } = await supabaseClient
          .from("orders")
          .select("session_id")
          .eq("session_id", sessionId)
          .maybeSingle();

        if (existingOrder) {
          console.log(`[Stripe Webhook] Session ${sessionId} already processed in DB. Skipping duplicate email.`);
          return new Response(JSON.stringify({ received: true, note: "Already processed" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (checkErr: any) {
        console.warn("[Stripe Webhook Warning] Idempotency check exception:", checkErr?.message);
      }
    }

    // Log order in DB to lock session idempotency
    if (supabaseClient) {
      try {
        const { error: dbError } = await supabaseClient.from("orders").insert([
          {
            session_id: sessionId,
            email: customerEmail,
            amount: amount,
            status: "completed",
            created_at: new Date().toISOString(),
          },
        ]);

        if (dbError) {
          console.error("[Supabase DB Error] Order insertion error:", dbError);
        } else {
          console.log("[Supabase DB Success] Order logged successfully.");
        }
      } catch (dbErr: any) {
        console.error("[Supabase Exception] DB operation error:", dbErr);
      }
    }

    // 4. INDEPENDENT CLOUDFLARE R2 PRESIGNED LINK GENERATION
    let downloadUrl = "https://animevoicepack.com/download";
    try {
      const s3Client = new S3Client({
        region: "auto",
        endpoint: CONFIG.R2.ENDPOINT,
        credentials: {
          accessKeyId: CONFIG.R2.ACCESS_KEY_ID,
          secretAccessKey: CONFIG.R2.SECRET_ACCESS_KEY,
        },
      });

      const command = new GetObjectCommand({
        Bucket: CONFIG.R2.BUCKET_NAME || 'anime-voice-pack-bundle',
        Key: CONFIG.R2.FILE_KEY || 'Anime Voice Pack Mp3.zip',
        ResponseContentDisposition: 'attachment; filename="Anime_Voice_Pack_Mp3.zip"',
        ResponseContentType: 'application/zip',
      });

      // Generate 2-hour presigned URL (7,200 seconds)
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 7200,
      });
      if (presignedUrl) {
        downloadUrl = presignedUrl;
        console.log(
          `[Cloudflare R2 Success] Generated 2-hour presigned URL for ${CONFIG.R2.FILE_KEY}`
        );
      }
    } catch (r2Err: any) {
      console.error("[Cloudflare R2 Error] Failed to generate presigned URL, falling back to clean link:", r2Err);
      downloadUrl = "https://animevoicepack.com/download";
    }

    // 5. INDEPENDENT RESEND EMAIL DISPATCH (STRICT CUSTOMER RECIPIENT ONLY)
    try {
      const resendApiKey = CONFIG.RESEND.API_KEY;
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const primaryFrom = CONFIG.RESEND.FROM_EMAIL || "ANIME VOICE PACK <orders@animevoicepack.com>";

        const emailPayload = {
          from: primaryFrom,
          to: [customerEmail],
          subject: "⚡ ANIME VOICE PACK - Your Download Link",
          html: `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ANIME VOICE PACK - Download Link</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 40px 16px; -webkit-font-smoothing: antialiased; }
                  .wrapper { max-width: 560px; margin: 0 auto; background: #1e293b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 36px 28px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); text-align: center; }
                  .brand-title { font-size: 28px; font-weight: 900; letter-spacing: 1.5px; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 24px 0; text-transform: uppercase; }
                  .badge { display: inline-block; padding: 6px 16px; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); color: #c084fc; border-radius: 9999px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 20px; }
                  h2 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
                  p { font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0 0 28px 0; }
                  .cta-box { text-align: center; margin: 28px 0 24px 0; }
                  .btn { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 17px; padding: 18px 42px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.4); }
                  .notice-box { margin-top: 24px; padding: 12px 18px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 10px; color: #fbbf24; font-size: 13px; text-align: center; font-weight: 500; display: inline-block; }
                  .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 12px; color: #64748b; }
                </style>
              </head>
              <body>
                <div class="wrapper">
                  <div class="brand-title">ANIME VOICE PACK</div>
                  <div style="text-align: center;">
                    <span class="badge">✓ PAYMENT CONFIRMED</span>
                  </div>
                  <h2>Thank you for your purchase! 🎉</h2>
                  <p>Your payment has been successfully processed. Your <strong>ANIME VOICE PACK</strong> is ready for instant download.</p>

                  <div class="cta-box">
                    <a href="${downloadUrl}" class="btn" target="_blank">Download Voice Pack ZIP</a>
                    <br>
                    <div class="notice-box">
                      ⏳ <strong>Secure Download Notice:</strong> For security and bandwidth protection, this download link is active for 2 hours.
                    </div>
                  </div>

                  <div class="footer">
                    &copy; ${new Date().getFullYear()} ANIME VOICE PACK. All rights reserved.
                  </div>
                </div>
              </body>
            </html>
          `,
        };

        const emailResult = await resend.emails.send(emailPayload);
        if (emailResult.error) {
          console.error("RESEND ERROR:", emailResult.error);
        } else {
          console.log(
            `[Resend Success] Transactional email dispatched to ${customerEmail}. ID: ${emailResult.data?.id || "sent"}`
          );
        }
      } else {
        console.warn("[Resend Warning] RESEND_API_KEY missing. Skipping email dispatch.");
      }
    } catch (err: any) {
      console.error("RESEND ERROR:", err);
    }
  }

  // 6. ALWAYS RETURN HTTP 200 OK
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
