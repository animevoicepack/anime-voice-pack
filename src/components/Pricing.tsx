"use client";

import React, { useState } from "react";

interface PricingProps {
  email: string;
  setEmail: (email: string) => void;
  onCheckout: (email: string) => void;
  isLoading: boolean;
}

export default function Pricing({ email, setEmail, onCheckout, isLoading }: PricingProps) {
  const [error, setError] = useState("");

  const handleCheckoutClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required to dispatch your secure link.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    onCheckout(email);
  };

  return (
    <section id="pricing" className="pricing-section" style={{ padding: "80px 0" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 className="section-title" style={{ fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.02em", color: "#ffffff", marginBottom: "12px" }}>
            Get Instant Access Now
          </h2>
          <p className="section-subtitle" style={{ fontSize: "1.125rem", color: "#94a3b8", maxWidth: "600px", margin: "0 auto" }}>
            Get your premium voice pack bundle today at a limited-time 50% discount.
          </p>
        </div>

        <div className="pricing-card-container" style={{ maxWidth: "640px", margin: "0 auto" }}>
          <div
            className="pricing-card"
            style={{
              position: "relative",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "24px",
              boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.07)",
              padding: "40px 32px",
              color: "#0f172a",
              overflow: "hidden",
            }}
          >
            {/* Discount Ribbon */}
            <div
              style={{
                position: "absolute",
                top: "24px",
                right: "-32px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                color: "#ffffff",
                fontSize: "0.75rem",
                fontWeight: 800,
                padding: "6px 40px",
                transform: "rotate(45deg)",
                boxShadow: "0 4px 10px rgba(139, 92, 246, 0.3)",
                letterSpacing: "0.05em",
              }}
            >
              50% OFF
            </div>
            
            <div style={{ marginBottom: "28px" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "rgba(139, 92, 246, 0.1)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  color: "#7c3aed",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  borderRadius: "9999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "12px",
                }}
              >
                Limited Time Offer
              </span>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0f172a", margin: "0 0 6px 0" }}>
                ANIME VOICE PACK
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#475569", margin: 0, fontWeight: 500 }}>
                1,000+ Clean High-Quality Audio Samples
              </p>
            </div>

            {/* Price Container */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "16px",
                border: "1px solid #f1f5f9",
                marginBottom: "28px",
              }}
            >
              <span style={{ fontSize: "1.25rem", color: "#94a3b8", textDecoration: "line-through", fontWeight: 600 }}>
                $100
              </span>
              <span style={{ fontSize: "2.75rem", fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
                $50
              </span>
              <span style={{ fontSize: "0.875rem", color: "#475569", fontWeight: 600 }}>
                USD &bull; One-time payment
              </span>
            </div>

            {/* Included Features Checklist */}
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { text: "ALL OF THE ANIME CHARACTERS' VOICE-OVERS READY TO CLONE.", isHighlight: true },
                { text: "1,000+ ultra-clear voice files/samples", isHighlight: false },
                { text: "Perfectly isolated & normalized MP3 files", isHighlight: false },
                { text: "Sorted across 16+ Anime series", isHighlight: false },
                { text: "100% ready for Discord soundboards, content edits, and parodies", isHighlight: false },
                { text: "Perfect for custom WhatsApp voice messages & Discord sounds", isHighlight: false },
              ].map((feat, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    fontSize: feat.isHighlight ? "0.98rem" : "0.95rem",
                    color: feat.isHighlight ? "#0f172a" : "#334155",
                    fontWeight: feat.isHighlight ? 800 : 500,
                  }}
                >
                  <span style={{ color: "#16a34a", fontWeight: 800, fontSize: "1.1rem" }}>✓</span>
                  <span>{feat.text}</span>
                </li>
              ))}
            </ul>

            {/* Purchase Form */}
            <form onSubmit={handleCheckoutClick} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  htmlFor="pricing-email"
                  style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}
                >
                  Delivery Email Address:
                </label>
                <input
                  id="pricing-email"
                  type="email"
                  placeholder="Enter your email to receive your secure download link"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    backgroundColor: "#ffffff",
                    border: error ? "2px solid #ef4444" : "1px solid #e2e8f0",
                    borderRadius: "12px",
                    outline: "none",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    if (!error) {
                      e.target.style.borderColor = "#8b5cf6";
                      e.target.style.boxShadow = "0 0 0 3px rgba(139, 92, 246, 0.25)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!error) {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                    }
                  }}
                />
                {error && <span style={{ display: "block", fontSize: "0.8125rem", color: "#dc2626", marginTop: "6px", fontWeight: 600 }}>{error}</span>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  border: "none",
                  borderRadius: "12px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)",
                  transition: "all 0.2s ease",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Redirecting to checkout..." : "Proceed to Secure Stripe Checkout → ($50 USD)"}
              </button>
            </form>

            {/* Trust Micro-Badges */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "12px",
                marginTop: "24px",
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
                  padding: "6px 14px",
                  borderRadius: "9999px",
                }}
              >
                <span>⚡</span> Instant Secure Cloudflare R2 Download
              </div>
            </div>

            {/* Security Disclaimer */}
            <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "16px", textAlign: "center", lineHeight: "1.5" }}>
              🔒 <strong>Important:</strong> Your unique secure download link is generated via Cloudflare R2 immediately after Stripe payment verification. The download link remains active for 2 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
