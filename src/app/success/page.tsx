"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const runtime = 'edge';

interface OrderDetails {
  sessionId: string;
  customerEmail?: string;
  amountTotal?: string;
  currency?: string;
  paymentStatus?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");

  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Email Lookup Form State (when no session_id in URL)
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    async function verifyAndFetchUrl() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/get-download-url?session_id=${encodeURIComponent(sessionId!)}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Unable to verify order or generate download link.");
        }

        setDownloadUrl(data.downloadUrl);
        if (data.order) {
          setOrder(data.order);
        }
      } catch (err: any) {
        console.error("[Success Page Error]:", err);
        setError(err.message || "Failed to verify payment session.");
      } finally {
        setLoading(false);
      }
    }

    verifyAndFetchUrl();
  }, [sessionId]);

  const handleEmailLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupEmail || !lookupEmail.trim()) {
      setLookupError("Please enter your checkout email address.");
      return;
    }

    try {
      setLookupLoading(true);
      setLookupError(null);

      const res = await fetch("/api/retrieve-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lookupEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "No completed purchase found for this email address. Please check your spelling or verify your order."
        );
      }

      setDownloadUrl(data.downloadUrl);
      if (data.order) {
        setOrder(data.order);
      }
    } catch (err: any) {
      console.error("[Email Lookup Error]:", err);
      setLookupError(err.message || "Could not retrieve order. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070a12",
        color: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          width: "100%",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "#0b0f19",
          padding: "16px 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "1.25rem",
              fontWeight: 900,
              letterSpacing: "1px",
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            ANIME VOICE PACK
          </Link>

          <Link
            href="/"
            style={{
              padding: "8px 18px",
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "#94a3b8",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "9999px",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            ← Return to Homepage
          </Link>
        </div>
      </header>

      {/* Main Full-Width Content Container */}
      <main style={{ flex: 1, width: "100%", padding: "48px 20px 80px 20px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  border: "4px solid rgba(255, 255, 255, 0.1)",
                  borderTopColor: "#a855f7",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 28px auto",
                }}
              />
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}>
                Verifying order and preparing your download link...
              </h2>
              <p style={{ fontSize: "1.05rem", color: "#94a3b8", margin: 0 }}>
                Please hold on while we validate your Stripe payment and generate your secure Cloudflare R2 download link.
              </p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 24px auto",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "36px", color: "#ef4444" }}>⚠️</span>
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#f87171", marginBottom: "16px" }}>
                Unable to Access Download
              </h2>
              <p style={{ fontSize: "1.1rem", color: "#cbd5e1", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto 32px auto" }}>
                {error}
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  padding: "16px 32px",
                  background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "1rem",
                  borderRadius: "14px",
                  boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.4)",
                }}
              >
                ← Return to Homepage
              </Link>
            </div>
          ) : !downloadUrl ? (
            /* IF NO SESSION_ID OR NO DOWNLOAD URL RETURNED YET: RETRIEVE YOUR ORDER VIEW */
            <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 24px auto",
                  background: "rgba(168, 85, 247, 0.12)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 30px -6px rgba(168, 85, 247, 0.3)",
                }}
              >
                <span style={{ fontSize: "36px" }}>🔍</span>
              </div>

              <div
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  background: "rgba(168, 85, 247, 0.15)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  color: "#c084fc",
                  fontSize: "0.8125rem",
                  fontWeight: 800,
                  borderRadius: "9999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "20px",
                }}
              >
                Order Lookup
              </div>

              <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", margin: "0 0 16px 0" }}>
                Retrieve Your Order
              </h1>

              <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: "1.6", margin: "0 0 36px 0" }}>
                Enter the email address you used at checkout to access your <strong>1,000+ Anime Voice Pack</strong> download link.
              </p>

              {/* Retrieval Form Card */}
              <div
                style={{
                  background: "#0b0f19",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  padding: "36px 28px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                  textAlign: "left",
                }}
              >
                <form onSubmit={handleEmailLookupSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label
                      htmlFor="lookup-email"
                      style={{ display: "block", fontSize: "0.9375rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "10px" }}
                    >
                      Checkout Email Address:
                    </label>
                    <input
                      id="lookup-email"
                      type="email"
                      placeholder="e.g. yourname@example.com"
                      value={lookupEmail}
                      onChange={(e) => {
                        setLookupEmail(e.target.value);
                        if (lookupError) setLookupError(null);
                      }}
                      disabled={lookupLoading}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        fontSize: "1rem",
                        color: "#ffffff",
                        backgroundColor: "#161c2e",
                        border: lookupError ? "2px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "12px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    {lookupError && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "12px 16px",
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          borderRadius: "10px",
                          color: "#fca5a5",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                        }}
                      >
                        ⚠️ {lookupError}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={lookupLoading}
                    style={{
                      width: "100%",
                      padding: "18px 28px",
                      fontSize: "1.1rem",
                      fontWeight: 900,
                      color: "#ffffff",
                      background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                      border: "none",
                      borderRadius: "14px",
                      cursor: lookupLoading ? "not-allowed" : "pointer",
                      boxShadow: "0 12px 30px -5px rgba(168, 85, 247, 0.4)",
                      opacity: lookupLoading ? 0.7 : 1,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {lookupLoading ? "Searching for your order..." : "Find My Download →"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* PAID & VERIFIED FULL-PAGE DOWNLOAD VIEW */
            <div>
              {/* Top Banner Status */}
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div
                  style={{
                    width: "84px",
                    height: "84px",
                    margin: "0 auto 24px auto",
                    background: "rgba(34, 197, 94, 0.12)",
                    border: "2px solid rgba(34, 197, 94, 0.35)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 15px 35px -5px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <svg
                    style={{ width: "44px", height: "44px", color: "#4ade80" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 18px",
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    color: "#4ade80",
                    fontSize: "0.8125rem",
                    fontWeight: 800,
                    borderRadius: "9999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "16px",
                  }}
                >
                  ✓ Payment Verified & Paid
                </div>

                <h1 style={{ fontSize: "2.75rem", fontWeight: 900, color: "#ffffff", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
                  Order Confirmed! 🎉
                </h1>

                <p style={{ fontSize: "1.15rem", color: "#cbd5e1", lineHeight: "1.6", maxWidth: "640px", margin: "0 auto" }}>
                  Thank you for your purchase! Your <strong>ANIME VOICE PACK</strong> digital bundle is ready for instant download.
                </p>
              </div>

              {/* Download Action Section */}
              <div
                style={{
                  background: "#0b0f19",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "24px",
                  padding: "36px 32px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  marginBottom: "40px",
                }}
              >
                {downloadUrl && (
                  <div style={{ marginBottom: "24px" }}>
                    <a
                      href={downloadUrl}
                      download
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "22px 28px",
                        background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontWeight: 900,
                        fontSize: "1.3rem",
                        borderRadius: "16px",
                        boxShadow: "0 15px 35px -6px rgba(168, 85, 247, 0.5)",
                        boxSizing: "border-box",
                        textAlign: "center",
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      ⚡ DOWNLOAD ANIME VOICE PACK NOW
                    </a>
                  </div>
                )}

                {/* Expiration Note Box */}
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    marginBottom: "20px",
                    color: "#fbbf24",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    lineHeight: "1.5",
                  }}
                >
                  ⏳ <strong>Note:</strong> Your unique download link is active for <strong>2 hours</strong>. Please download your files promptly.
                </div>

                {/* Backup Receipt Box */}
                <div
                  style={{
                    background: "rgba(34, 197, 94, 0.08)",
                    border: "1px solid rgba(34, 197, 94, 0.25)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                    color: "#86efac",
                    fontSize: "0.9375rem",
                    lineHeight: "1.5",
                  }}
                >
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 6px 0", color: "#4ade80" }}>
                    📧 Having trouble or need to download later?
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#cbd5e1" }}>
                    A copy of your purchase receipt with a link back to this page has been sent to your email by Stripe. If your download fails, expires, or you need to access your files again later, simply click the link in your email receipt and enter your email to get a fresh download link anytime.
                  </p>
                </div>
              </div>

              {/* 2-Column Desktop Grid for Order Details & Tutorial */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "24px",
                  marginBottom: "40px",
                }}
              >
                {/* Left Card: Order Receipt Summary */}
                <div
                  style={{
                    background: "#0b0f19",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    padding: "28px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: "#94a3b8",
                      margin: "0 0 16px 0",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Receipt Details
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.95rem" }}>
                    {order?.customerEmail && (
                      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "10px" }}>
                        <span style={{ color: "#94a3b8" }}>Customer Email:</span>
                        <strong style={{ color: "#ffffff" }}>{order.customerEmail}</strong>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "10px" }}>
                      <span style={{ color: "#94a3b8" }}>Total Amount:</span>
                      <strong style={{ color: "#4ade80" }}>${order?.amountTotal || "50.00"} {order?.currency || "USD"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "10px" }}>
                      <span style={{ color: "#94a3b8" }}>Payment Status:</span>
                      <strong style={{ color: "#c084fc", textTransform: "uppercase" }}>{order?.paymentStatus || "PAID"}</strong>
                    </div>
                    {order?.sessionId && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Checkout Session ID:</span>
                        <span style={{ color: "#64748b", fontSize: "0.8125rem", fontFamily: "monospace", wordBreak: "break-all" }}>
                          {order.sessionId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Card: Quickstart & Video Guide */}
                <div
                  style={{
                    background: "#0b0f19",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff", margin: "0 0 10px 0" }}>
                      🎬 What to do next?
                    </h3>
                    <p style={{ fontSize: "0.9375rem", color: "#94a3b8", lineHeight: "1.6", margin: "0 0 20px 0" }}>
                      Learn how to extract your audio samples, import them into your favorite soundboard, and send custom voice clips on Discord & WhatsApp!
                    </p>
                  </div>

                  <a
                    href="https://youtu.be/4AtRNQIbDmc"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      width: "100%",
                      padding: "14px",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#ffffff",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "0.9375rem",
                      borderRadius: "12px",
                      textAlign: "center",
                      boxSizing: "border-box",
                      transition: "background 0.2s ease",
                    }}
                  >
                    Watch the Video Tutorial Guide →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "#0b0f19",
          padding: "24px 20px",
          textAlign: "center",
          color: "#64748b",
          fontSize: "0.875rem",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          &copy; {new Date().getFullYear()} Anime Voice Pack. All rights reserved. &bull; Powered by Stripe & Cloudflare R2
        </div>
      </footer>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#070a12",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          Verifying order and preparing your download link...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
