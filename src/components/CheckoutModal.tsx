"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadStripe, StripeEmbeddedCheckout } from "@stripe/stripe-js";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  process.env.STRIPE_PUBLISHABLE_KEY ||
  "pk_test_placeholder";

const stripePromise = loadStripe(publishableKey);

export default function CheckoutModal({ isOpen, onClose, email }: CheckoutModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function initCheckout() {
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Failed to load Stripe SDK.");
        }

        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (!res.ok || !data.clientSecret) {
          throw new Error(data.error || "Could not create checkout session.");
        }

        if (!isMounted) return;

        const checkout = await (stripe as any).createEmbeddedCheckoutPage({
          clientSecret: data.clientSecret,
        });

        checkoutRef.current = checkout;

        if (containerRef.current) {
          checkout.mount(containerRef.current);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Embedded checkout initialization error:", err);
        if (isMounted) {
          setError(err.message || "Failed to load checkout.");
          setLoading(false);
        }
      }
    }

    initCheckout();

    return () => {
      isMounted = false;
      if (checkoutRef.current) {
        checkoutRef.current.destroy();
        checkoutRef.current = null;
      }
    };
  }, [isOpen, email]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content glass pulsing-glow"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "700px",
          width: "92%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
          position: "relative",
          background: "#0f172a",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.7)",
        }}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: "12px",
          }}
        >
          <div>
            <h2 className="modal-title" style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
              Complete Your Order
            </h2>
            <p className="modal-subtitle" style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0 }}>
              Ultimate Anime Voice Pack Bundle
            </p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              fontSize: "28px",
              cursor: "pointer",
              background: "none",
              border: "none",
              color: "#94a3b8",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#c084fc" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>⚡ Loading Secure Stripe Checkout...</p>
          </div>
        )}

        {error && (
          <div
            style={{
              color: "#ef4444",
              padding: "20px",
              textAlign: "center",
              background: "rgba(239, 68, 68, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              margin: "16px 0",
            }}
          >
            <p style={{ margin: 0 }}>{error}</p>
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ marginTop: "12px", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        )}

        <div
          ref={containerRef}
          id="checkout-embedded-container"
          style={{ minHeight: loading ? "0px" : "400px" }}
        />
      </div>
    </div>
  );
}
