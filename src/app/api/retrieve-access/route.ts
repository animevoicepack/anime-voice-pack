import { NextResponse } from "next/server";
import Stripe from "stripe";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CONFIG } from "@/lib/config";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";

    if (!rawEmail) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const targetEmail = rawEmail.toLowerCase();

    const stripeSecretKey = CONFIG.STRIPE.SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, error: "Stripe configuration error: missing secret key." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    });

    let paidSession: Stripe.Checkout.Session | null = null;

    // List recent checkout sessions and find completed paid session matching customer email
    try {
      const listResult = await stripe.checkout.sessions.list({
        limit: 100,
      });

      paidSession =
        listResult.data.find((s) => {
          const sEmail = (s.customer_details?.email || s.customer_email || "").toLowerCase();
          return sEmail === targetEmail && s.payment_status === "paid" && s.status === "complete";
        }) || null;
    } catch (listErr) {
      console.error("[Stripe List Checkout Sessions Error]:", listErr);
    }

    if (!paidSession) {
      return NextResponse.json(
        {
          success: false,
          error: "No completed purchase found for this email address. Please check your spelling or verify your order.",
        },
        { status: 403 }
      );
    }

    // Calculate elapsed time from Stripe purchase creation timestamp (paidSession.created in seconds)
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const purchaseTimeInSeconds = paidSession.created || nowInSeconds;
    const elapsedSeconds = nowInSeconds - purchaseTimeInSeconds;
    const remainingSeconds = 7200 - elapsedSeconds;

    if (remainingSeconds <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Your 2-hour download window for this order has expired.",
          expired: true,
        },
        { status: 403 }
      );
    }

    // Generate signed Cloudflare R2 download URL with TTL dynamic to remaining time (max 7,200 seconds)
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
      ResponseContentDisposition: 'attachment; filename="Anime_Voice_Pack_Mp3.zip"',
      ResponseContentType: "application/zip",
    });

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: Math.min(remainingSeconds, 7200),
    });

    const customerEmail = paidSession.customer_details?.email || paidSession.customer_email || targetEmail;
    const amountTotal = paidSession.amount_total ? (paidSession.amount_total / 100 % 1 === 0 ? (paidSession.amount_total / 100).toString() : (paidSession.amount_total / 100).toFixed(2)) : "50";
    const currency = (paidSession.currency || "usd").toUpperCase();

    return NextResponse.json({
      success: true,
      downloadUrl,
      order: {
        sessionId: paidSession.id,
        customerEmail,
        amountTotal,
        currency,
        paymentStatus: paidSession.payment_status,
      },
    });
  } catch (err: any) {
    console.error("[Retrieve Access Exception]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process retrieval request." },
      { status: 500 }
    );
  }
}
