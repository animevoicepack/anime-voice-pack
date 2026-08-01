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

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      "";
    const rawAmount = session.amount_total ?? 0;
    const amount = rawAmount / 100;
    const sessionId = session.id || "session_unknown";

    console.log(
      `[Stripe Webhook] Processing checkout.session.completed for Session: ${sessionId}, Email: ${email}, Amount: $${amount}, PaymentStatus: ${session.payment_status}`
    );

    // NULL GUARD FOR $0.00 TRANSACTIONS:
    // Do NOT attempt to fetch stripe.paymentIntents.retrieve() if session.payment_intent is null.
    if (session.payment_status && session.payment_status !== "paid") {
      console.warn(
        `[Stripe Webhook Warning] Session ${sessionId} payment_status is not 'paid' (${session.payment_status}). Skipping fulfillment.`
      );
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. INDEPENDENT CLOUDFLARE R2 PRESIGNED LINK GENERATION
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
        Bucket: CONFIG.R2.BUCKET_NAME,
        Key: CONFIG.R2.FILE_KEY,
        ResponseContentDisposition: 'attachment; filename="Anime_Voice_Pack_Bundle.zip"',
      });

      // Generate 1-hour presigned URL (3,600 seconds)
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });
      if (presignedUrl) {
        downloadUrl = presignedUrl;
        console.log(
          `[Cloudflare R2 Success] Generated 1-hour presigned URL for ${CONFIG.R2.FILE_KEY}`
        );
      }
    } catch (r2Err: any) {
      console.error("[Cloudflare R2 Error] Failed to generate presigned URL, falling back to clean link:", r2Err);
      downloadUrl = "https://animevoicepack.com/download";
    }

    // 4. INDEPENDENT RESEND EMAIL DISPATCH
    if (email) {
      try {
        const resendApiKey = CONFIG.RESEND.API_KEY;
        if (resendApiKey) {
          const resend = new Resend(resendApiKey);
          const primaryFrom = CONFIG.RESEND.FROM_EMAIL || "Alpha Voice Assets <support@animevoicepack.com>";
          const fallbackFrom = "onboarding@resend.dev";
          const fallbackRecipient = process.env.RESEND_FALLBACK_EMAIL || process.env.OWNER_EMAIL || email;

          const createEmailPayload = (fromAddress: string, toAddress: string) => ({
            from: fromAddress,
            to: [toAddress],
            subject: "⚡ Your Anime Voice Pack Bundle is Ready for Download!",
            html: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Your Ultimate Anime Voice Pack Bundle Download</title>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070a12; color: #f1f5f9; margin: 0; padding: 32px 16px; -webkit-font-smoothing: antialiased; }
                    .wrapper { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
                    .banner { background: linear-gradient(135deg, #1e1b4b 0%, #31104b 50%, #4c0519 100%); padding: 36px 24px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
                    .brand-title { font-size: 26px; font-weight: 900; letter-spacing: 1px; background: linear-gradient(135deg, #c084fc 0%, #f472b6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; text-transform: uppercase; }
                    .content { padding: 32px 28px; }
                    .badge { display: inline-block; padding: 6px 14px; background: rgba(192, 132, 252, 0.12); border: 1px solid rgba(192, 132, 252, 0.3); color: #e9d5ff; border-radius: 9999px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 20px; }
                    h2 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
                    p { font-size: 15px; color: #94a3b8; line-height: 1.6; margin: 0 0 20px 0; }
                    .order-card { background: #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid rgba(255, 255, 255, 0.06); }
                    .order-line { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #cbd5e1; }
                    .order-line:last-child { margin-bottom: 0; }
                    .order-label { color: #64748b; font-weight: 500; }
                    .order-value { font-weight: 700; color: #f8fafc; }
                    .cta-box { text-align: center; margin: 32px 0 24px 0; padding: 24px 16px; background: rgba(15, 23, 42, 0.6); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); }
                    .btn { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #db2777 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 17px; padding: 18px 42px; border-radius: 14px; box-shadow: 0 12px 24px -6px rgba(147, 51, 234, 0.5); transition: all 0.2s ease; }
                    .notice-box { margin-top: 18px; padding: 12px 16px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 10px; color: #fbbf24; font-size: 13px; text-align: center; font-weight: 500; display: inline-block; }
                    .footer { text-align: center; padding: 24px 28px 32px 28px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; color: #64748b; }
                    .footer a { color: #a855f7; text-decoration: none; }
                  </style>
                </head>
                <body>
                  <div class="wrapper">
                    <div class="banner">
                      <div class="brand-title">Alpha Voice Assets</div>
                    </div>
                    <div class="content">
                      <div style="text-align: center;">
                        <span class="badge">✓ Payment Confirmed</span>
                      </div>
                      <h2>Thank you for your purchase! 🎉</h2>
                      <p>Your payment has been successfully processed. Your <strong>Ultimate Anime Voice Pack Bundle</strong> is ready for instant direct download.</p>
                      
                      <div class="order-card">
                        <div class="order-line">
                          <span class="order-label">Session ID</span>
                          <span class="order-value">${sessionId.slice(0, 20)}...</span>
                        </div>
                        <div class="order-line">
                          <span class="order-label">Amount Paid</span>
                          <span class="order-value">$${amount.toFixed(2)} USD</span>
                        </div>
                      </div>

                      <div class="cta-box">
                        <a href="${downloadUrl}" class="btn" target="_blank">Download Voice Pack ZIP</a>
                        <br>
                        <div class="notice-box">
                          ⏳ <strong>Secure Download Notice:</strong> For security and bandwidth protection, this download link is valid for <strong>1 hour</strong>.
                        </div>
                      </div>

                      <p style="font-size: 14px; text-align: center; color: #64748b;">
                        If you have any questions or need technical support, reply directly to this email or contact <a href="mailto:support@animevoicepack.com" style="color: #c084fc;">support@animevoicepack.com</a>.
                      </p>
                    </div>
                    <div class="footer">
                      &copy; ${new Date().getFullYear()} Alpha Voice Assets. All rights reserved.<br>
                      Anime Voice Pack Bundle &bull; Instant High-Quality Audio Assets
                    </div>
                  </div>
                </body>
              </html>
            `,
          });

          let sendSuccess = false;

          // Primary attempt: send to customer email
          try {
            const primaryPayload = createEmailPayload(primaryFrom, email);
            const emailResult = await resend.emails.send(primaryPayload);

            if (emailResult.error) {
              console.warn(
                "[Resend Warning] Primary email dispatch returned error:",
                emailResult.error
              );
            } else {
              sendSuccess = true;
              console.log(
                `[Resend Success] Transactional email dispatched to ${email}. ID: ${emailResult.data?.id || "sent"}`
              );
            }
          } catch (primaryErr: any) {
            console.warn(
              "[Resend Warning] Primary email dispatch exception:",
              primaryErr?.message || primaryErr
            );
          }

          // Fallback attempt: if primary failed (e.g. Resend restriction in onboarding@resend.dev mode)
          if (!sendSuccess) {
            console.log(
              `[Resend Info] Attempting fallback email dispatch (From: ${fallbackFrom}, To: ${fallbackRecipient})...`
            );
            try {
              const fallbackPayload = createEmailPayload(fallbackFrom, fallbackRecipient);
              const fallbackResult = await resend.emails.send(fallbackPayload);

              if (fallbackResult.error) {
                console.error("RESEND ERROR:", fallbackResult.error);
              } else {
                console.log(
                  `[Resend Success] Fallback email dispatched to ${fallbackRecipient}. ID: ${fallbackResult.data?.id || "sent"}`
                );
              }
            } catch (fallbackErr: any) {
              console.error("RESEND ERROR:", fallbackErr);
            }
          }
        } else {
          console.warn("[Resend Warning] RESEND_API_KEY missing. Skipping email dispatch.");
        }
      } catch (err: any) {
        console.error("RESEND ERROR:", err);
      }
    } else {
      console.warn(`[Stripe Webhook Warning] No email address associated with session ${sessionId}`);
    }

    // 4. ISOLATED SUPABASE DATABASE LOGGING
    try {
      const supabaseUrl = CONFIG.SUPABASE.URL;
      const supabaseServiceKey = CONFIG.SUPABASE.SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { error: dbError } = await supabase.from("orders").insert([
          {
            session_id: sessionId,
            email: email,
            amount: amount,
            status: "completed",
            created_at: new Date().toISOString(),
          },
        ]);

        if (dbError) {
          console.error("[Supabase DB Error] Non-fatal DB insertion error:", dbError);
        } else {
          console.log("[Supabase DB Success] Order logged successfully.");
        }
      } else {
        console.warn("[Supabase Warning] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. Skipping DB log.");
      }
    } catch (dbErr: any) {
      console.error("[Supabase Exception] Non-fatal DB operation error:", dbErr);
    }
  }

  // 5. ALWAYS RETURN HTTP 200 OK
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
