import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CONFIG } from "@/lib/config";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" && body.email.trim() ? body.email.trim() : undefined;

    const stripeSecretKey = CONFIG.STRIPE.SECRET_KEY;
    if (!stripeSecretKey) {
      console.error("[Stripe Error] STRIPE_SECRET_KEY is missing from environment variables");
      return NextResponse.json(
        { error: "Stripe configuration error: STRIPE_SECRET_KEY is missing." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    });

    const host = req.headers.get("host") || "animevoicepack.com";
    const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      allow_promotion_codes: true,
      return_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: email,
      payment_intent_data: email ? { receipt_email: email } : undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ANIME VOICE PACK',
              description: '1,000+ isolated anime voice audio samples',
            },
            unit_amount: 5000, // $50 USD (5000 cents)
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err: any) {
    console.error("[Stripe Error] Failed to create embedded checkout session:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
