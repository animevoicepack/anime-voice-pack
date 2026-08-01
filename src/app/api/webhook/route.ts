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

  if (!signature) {
    console.error("[Webhook Error] Missing stripe-signature header");
    return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const webhookSecret = CONFIG.STRIPE.WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Webhook Error] STRIPE_WEBHOOK_SECRET is missing");
    return new Response(JSON.stringify({ error: "Webhook secret configuration missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(CONFIG.STRIPE.SECRET_KEY || "", {
    apiVersion: "2025-02-24.acacia" as any,
  });

  let event: Stripe.Event;

  // 1. Stripe Signature Verification
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[Webhook Signature Verification Failed]: ${err.message}`);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Fulfillment Handler for checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      "";
    const rawAmount = session.amount_total ?? 0;
    const amount = rawAmount / 100;
    const sessionId = session.id;

    console.log(
      `[Stripe Webhook] Processing checkout.session.completed for Session: ${sessionId}, Email: ${email}, Amount: $${amount}, PaymentStatus: ${session.payment_status}`
    );

    // NULL GUARD FOR $0.00 TRANSACTIONS:
    // Do NOT attempt to fetch stripe.paymentIntents.retrieve() if session.payment_intent is null.
    if (session.payment_status !== "paid") {
      console.warn(
        `[Stripe Webhook Warning] Session ${sessionId} payment_status is not 'paid' (${session.payment_status}). Skipping fulfillment.`
      );
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. ISOLATED RESEND EMAIL DISPATCH & CLOUDFLARE R2 PRESIGNED LINK
    if (email) {
      try {
        let downloadUrl = "#";
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
          });

          // Generate 1-hour presigned URL (3,600 seconds)
          downloadUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          console.log(
            `[Cloudflare R2 Success] Generated 1-hour presigned URL for ${CONFIG.R2.FILE_KEY}`
          );
        } catch (r2Err: any) {
          console.error("[Cloudflare R2 Error] Failed to generate presigned URL:", r2Err);
        }

        const resendApiKey = CONFIG.RESEND.API_KEY;
        if (resendApiKey) {
          const resend = new Resend(resendApiKey);
          const fromEmail = CONFIG.RESEND.FROM_EMAIL || "onboarding@resend.dev";

          const emailPayload = {
            from: fromEmail,
            to: [email],
            subject: "Your Ultimate Anime Voice Pack Bundle Download Link",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 40px 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #151c2c; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
                    .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); }
                    .logo-text { font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                    .content { padding: 24px 0; line-height: 1.6; }
                    .badge { display: inline-block; padding: 6px 12px; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); color: #c084fc; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
                    .order-box { background: #0f172a; border-radius: 8px; padding: 16px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.05); }
                    .order-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #94a3b8; }
                    .btn-container { text-align: center; margin: 32px 0; }
                    .btn { display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 16px; padding: 16px 36px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.4); }
                    .warning { font-size: 13px; color: #f59e0b; text-align: center; margin-top: 12px; }
                    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <div class="logo-text">ANIME VOICE PACK BUNDLE</div>
                    </div>
                    <div class="content">
                      <div class="badge">Order Confirmed</div>
                      <h2>Thank you for your purchase! 🎉</h2>
                      <p>Your payment has been successfully processed. Your Ultimate Anime Voice Pack Bundle is ready to download.</p>
                      
                      <div class="order-box">
                        <div class="order-row"><span>Session ID:</span> <span>${sessionId.slice(0, 18)}...</span></div>
                        <div class="order-row"><span>Amount Paid:</span> <span>$${amount.toFixed(2)}</span></div>
                      </div>

                      <div class="btn-container">
                        <a href="${downloadUrl}" class="btn" target="_blank">Download Voice Pack ZIP</a>
                        <div class="warning">⚠️ Note: For security reasons, this download link is valid for 1 hour only.</div>
                      </div>

                      <p>If you have any questions or need assistance, please reply directly to this email.</p>
                    </div>
                    <div class="footer">
                      &copy; ${new Date().getFullYear()} Ultimate Anime Voice Pack Bundle. All rights reserved.
                    </div>
                  </div>
                </body>
              </html>
            `,
          };

          let emailResult;
          try {
            emailResult = await resend.emails.send(emailPayload);
          } catch (firstErr: any) {
            console.warn(
              "[Resend Warning] Primary email dispatch failed, attempting fallback to 'onboarding@resend.dev':",
              firstErr?.message
            );
            emailResult = await resend.emails.send({
              ...emailPayload,
              from: "onboarding@resend.dev",
            });
          }

          console.log(
            `[Resend Success] Transactional email dispatched to ${email}. ID: ${emailResult.data?.id || "sent"}`
          );
        } else {
          console.warn("[Resend Warning] RESEND_API_KEY missing. Skipping email dispatch.");
        }
      } catch (emailFulfillmentErr: any) {
        console.error("[Resend/R2 Fulfillment Exception] Non-fatal error during email dispatch:", emailFulfillmentErr);
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
