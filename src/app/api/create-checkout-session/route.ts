import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = 'edge';

const IS_TEST_MODE = true;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" && body.email.trim() ? body.email.trim() : undefined;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
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

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      return_url: 'https://animevoicepack.com/success?session_id={CHECKOUT_SESSION_ID}',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Ultimate Anime Voice Pack Bundle',
              description: '1,000+ isolated anime voice audio samples',
            },
            unit_amount: IS_TEST_MODE ? 0 : 5000,
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
