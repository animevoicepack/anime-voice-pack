"use client";

import React, { useCallback, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { CONFIG } from "@/lib/config";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  CONFIG.STRIPE.PUBLISHABLE_KEY ||
  "pk_test_51TzJCVK9A1fbNp7ufRqCkc6UKC2dlxVu4xOVixmGbuAwaq1z8IOAcafgTZIoXai6BbfkRe0qfrJ86AD9QNmtVITb00wM0VfWb4";

const stripePromise = loadStripe(publishableKey);

export default function CheckoutModal({ isOpen, onClose, email }: CheckoutModalProps) {
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCheckoutError(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchClientSecret = useCallback(async () => {
    try {
      setCheckoutError(null);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || "Could not create checkout session.");
      }
      return data.clientSecret;
    } catch (err: any) {
      console.error("[CheckoutModal Error]:", err);
      setCheckoutError(err.message || "Failed to load checkout session.");
      throw err;
    }
  }, [email]);

  if (!isOpen) return null;

  return (
    <div
      id="full-screen-checkout"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        overflowY: "auto",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "840px",
          margin: "0 auto",
          padding: "24px 20px 48px 20px",
          boxSizing: "border-box",
        }}
      >
        {/* Sleek Top Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f5f9",
            paddingBottom: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "1.125rem",
                fontWeight: 900,
                letterSpacing: "1px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textTransform: "uppercase",
              }}
            >
              ANIME VOICE PACK
            </span>
            <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>&bull;</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#475569" }}>
              Secure Instant Checkout
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close checkout"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              fontSize: "0.875rem",
              fontWeight: 700,
              cursor: "pointer",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#475569",
              borderRadius: "9999px",
              transition: "all 0.2s ease",
            }}
          >
            <span>Close</span>
            <span style={{ fontSize: "16px", lineHeight: 1 }}>&times;</span>
          </button>
        </div>

        {/* Error Alert Box if session creation fails */}
        {checkoutError ? (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: "16px",
              padding: "32px 24px",
              textAlign: "center",
              margin: "32px 0",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#991b1b", margin: "0 0 8px 0" }}>
              Unable to Load Stripe Checkout
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#7f1d1d", margin: "0 0 20px 0" }}>
              {checkoutError}
            </p>
            <button
              onClick={onClose}
              style={{
                padding: "12px 24px",
                background: "#0f172a",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Close & Try Again
            </button>
          </div>
        ) : (
          /* Stripe Embedded Checkout Container */
          <div id="checkout" style={{ width: "100%", minHeight: "500px" }}>
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {/* Bottom Security / Delivery Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#475569",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: "8px 18px",
              borderRadius: "9999px",
            }}
          >
            <span>⚡</span> Instant Secure Download via Cloudflare R2
          </div>
        </div>
      </div>
    </div>
  );
}
