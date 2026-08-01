"use client";

import React, { useEffect, useRef, useState } from "react";
import { loadStripe, StripeEmbeddedCheckout } from "@stripe/stripe-js";
import { CONFIG } from "@/lib/config";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const publishableKey = CONFIG.STRIPE.PUBLISHABLE_KEY;
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
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#8b5cf6",
              colorBackground: "#ffffff",
              colorText: "#0f172a",
              borderRadius: "12px",
            },
          },
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
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "680px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px 28px",
          position: "relative",
          background: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.07)",
          color: "#0f172a",
        }}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "16px",
          }}
        >
          <div>
            <h2 className="modal-title" style={{ fontSize: "1.375rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
              Complete Your Order
            </h2>
            <p className="modal-subtitle" style={{ fontSize: "0.875rem", color: "#475569", margin: "4px 0 0 0" }}>
              ANIME VOICE PACK &bull; Instant Secure Checkout
            </p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              fontSize: "20px",
              fontWeight: 700,
              cursor: "pointer",
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              color: "#475569",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              transition: "all 0.2s ease",
            }}
          >
            &times;
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#8b5cf6" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>⚡</div>
            <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Loading Secure Stripe Checkout...
            </p>
            <p style={{ fontSize: "0.875rem", color: "#475569", marginTop: "4px" }}>
              Please wait a moment while we prepare your payment form
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              color: "#dc2626",
              padding: "20px",
              textAlign: "center",
              background: "#fef2f2",
              borderRadius: "12px",
              border: "1px solid #fecaca",
              margin: "16px 0",
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>{error}</p>
            <button
              onClick={onClose}
              style={{
                marginTop: "12px",
                padding: "8px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#dc2626",
                color: "#ffffff",
                border: "none",
                fontWeight: 600,
              }}
            >
              Close
            </button>
          </div>
        )}

        <div
          ref={containerRef}
          id="checkout-embedded-container"
          style={{ minHeight: loading ? "0px" : "380px" }}
        />

        {/* Trust Badges */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid #e2e8f0",
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
              padding: "6px 14px",
              borderRadius: "9999px",
            }}
          >
            <span>⚡</span> Instant Direct Email Delivery
          </div>
        </div>
      </div>
    </div>
  );
}
