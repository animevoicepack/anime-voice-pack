import { NextResponse } from "next/server";
import Stripe from "stripe";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CONFIG } from "@/lib/config";

export const runtime = "edge";

async function handleGetDownloadUrl(sessionId: string | null) {
  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: "Missing session_id parameter." },
      { status: 400 }
    );
  }

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

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err: any) {
    console.error("[Stripe Error] Session retrieval failed:", err?.message || err);
    return NextResponse.json(
      { success: false, error: "Invalid or non-existent Checkout Session ID." },
      { status: 404 }
    );
  }

  if (session.payment_status !== "paid" || session.status !== "complete") {
    return NextResponse.json(
      {
        success: false,
        error: "Access denied. A completed paid order is required to generate a download link.",
        paymentStatus: session.payment_status,
        sessionStatus: session.status,
      },
      { status: 403 }
    );
  }

  // Generate signed Cloudflare R2 download URL expiring in 2 hours (7,200 seconds)
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
    expiresIn: 7200,
  });

  const customerEmail = session.customer_details?.email || session.customer_email || "";
  const amountTotal = session.amount_total ? (session.amount_total / 100 % 1 === 0 ? (session.amount_total / 100).toString() : (session.amount_total / 100).toFixed(2)) : "50";
  const currency = (session.currency || "usd").toUpperCase();

  return NextResponse.json({
    success: true,
    downloadUrl,
    order: {
      sessionId: session.id,
      customerEmail,
      amountTotal,
      currency,
      paymentStatus: session.payment_status,
    },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");
    return await handleGetDownloadUrl(sessionId);
  } catch (err: any) {
    console.error("[API Error] get-download-url GET handler exception:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = body.session_id || body.sessionId;
    return await handleGetDownloadUrl(sessionId);
  } catch (err: any) {
    console.error("[API Error] get-download-url POST handler exception:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
