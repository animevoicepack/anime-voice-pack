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
      // No session_id parameter: present order retrieval form
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
          data.error || "No completed order found for this email address. Please check your spelling."
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
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#070a12",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "660px", width: "100%" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            padding: "44px 32px",
            textAlign: "center",
            color: "#0f172a",
          }}
        >
          {loading ? (
            <div style={{ padding: "40px 0" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  border: "4px solid #e2e8f0",
                  borderTopColor: "#8b5cf6",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 24px auto",
                }}
              />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                Verifying order and preparing your download link...
              </h2>
              <p style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
                Please hold on while we validate your payment and generate your secure download link.
              </p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : error ? (
            <div>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  margin: "0 auto 24px auto",
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "32px", color: "#dc2626" }}>⚠️</span>
              </div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#991b1b", marginBottom: "12px" }}>
                Unable to Access Download
              </h2>
              <p style={{ fontSize: "1rem", color: "#475569", lineHeight: "1.6", marginBottom: "28px" }}>
                {error}
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  padding: "14px 28px",
                  background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  borderRadius: "12px",
                  boxShadow: "0 10px 20px -5px rgba(139, 92, 246, 0.4)",
                }}
              >
                ← Return to Homepage
              </Link>
            </div>
          ) : !downloadUrl ? (
            /* IF NO session_id OR NO DOWNLOAD URL RETURNED YET: SHOW "RETRIEVE YOUR ORDER" CARD */
            <div>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  margin: "0 auto 20px auto",
                  background: "rgba(139, 92, 246, 0.1)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 20px -5px rgba(139, 92, 246, 0.2)",
                }}
              >
                <span style={{ fontSize: "32px" }}>🔍</span>
              </div>

              <div
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  background: "rgba(139, 92, 246, 0.1)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  color: "#7c3aed",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  borderRadius: "9999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "16px",
                }}
              >
                Order Lookup
              </div>

              <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", margin: "0 0 12px 0" }}>
                Retrieve Your Order
              </h1>

              <p style={{ fontSize: "1rem", color: "#475569", lineHeight: "1.6", margin: "0 0 28px 0" }}>
                Enter the email address you used at checkout to access your <strong>1,000+ Anime Voice Pack</strong> download link.
              </p>

              {/* Retrieval Form */}
              <form onSubmit={handleEmailLookupSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left", marginBottom: "28px" }}>
                <div>
                  <label htmlFor="lookup-email" style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                    Checkout Email Address:
                  </label>
                  <input
                    id="lookup-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={lookupEmail}
                    onChange={(e) => {
                      setLookupEmail(e.target.value);
                      if (lookupError) setLookupError(null);
                    }}
                    disabled={lookupLoading}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      fontSize: "0.95rem",
                      color: "#0f172a",
                      backgroundColor: "#ffffff",
                      border: lookupError ? "2px solid #ef4444" : "1px solid #cbd5e1",
                      borderRadius: "12px",
                      outline: "none",
                      boxSizing: "border-box",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  {lookupError && (
                    <div style={{ marginTop: "10px", padding: "10px 14px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "10px", color: "#991b1b", fontSize: "0.875rem", fontWeight: 600 }}>
                      ⚠️ {lookupError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={lookupLoading}
                  style={{
                    width: "100%",
                    padding: "16px 24px",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                    border: "none",
                    borderRadius: "12px",
                    cursor: lookupLoading ? "not-allowed" : "pointer",
                    boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)",
                    opacity: lookupLoading ? 0.7 : 1,
                  }}
                >
                  {lookupLoading ? "Searching for your order..." : "Find My Download →"}
                </button>
              </form>

              <div>
                <Link
                  href="/"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textDecoration: "none",
                  }}
                >
                  ← Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            /* PAID & VERIFIED DOWNLOAD VIEW */
            <div>
              {/* Animated Green Checkmark Badge */}
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  margin: "0 auto 20px auto",
                  background: "#dcfce7",
                  border: "1px solid #86efac",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 20px -5px rgba(34, 197, 94, 0.3)",
                }}
              >
                <svg
                  style={{ width: "38px", height: "38px", color: "#16a34a" }}
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
                  padding: "4px 14px",
                  background: "rgba(139, 92, 246, 0.1)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  color: "#7c3aed",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  borderRadius: "9999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "16px",
                }}
              >
                ✓ Payment Verified & Paid
              </div>

              <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", margin: "0 0 12px 0" }}>
                Order Confirmed! 🎉
              </h1>

              <p style={{ fontSize: "1.05rem", color: "#334155", lineHeight: "1.6", margin: "0 0 24px 0" }}>
                Thank you for your purchase! Your <strong>ANIME VOICE PACK</strong> digital bundle is ready for instant download.
              </p>

              {/* Order Receipt Summary Box */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "24px",
                  textAlign: "left",
                }}
              >
                <h3 style={{ fontSize: "0.875rem", fontWeight: 800, textTransform: "uppercase", color: "#64748b", margin: "0 0 12px 0", letterSpacing: "0.05em" }}>
                  Receipt Summary
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.9375rem" }}>
                  {order?.customerEmail && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Email:</span>
                      <strong style={{ color: "#0f172a" }}>{order.customerEmail}</strong>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Total Paid:</span>
                    <strong style={{ color: "#16a34a" }}>${order?.amountTotal || "50.00"} {order?.currency || "USD"}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Payment Status:</span>
                    <strong style={{ color: "#7c3aed", textTransform: "uppercase" }}>{order?.paymentStatus || "PAID"}</strong>
                  </div>
                  {order?.sessionId && (
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", wordBreak: "break-all" }}>
                      <span style={{ color: "#64748b" }}>Session ID:</span>
                      <span style={{ color: "#64748b", fontSize: "0.8125rem", fontFamily: "monospace" }}>{order.sessionId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Prominent Direct Download Button */}
              {downloadUrl && (
                <div style={{ marginBottom: "24px" }}>
                  <a
                    href={downloadUrl}
                    download
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "20px 24px",
                      background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                      color: "#ffffff",
                      textDecoration: "none",
                      fontWeight: 900,
                      fontSize: "1.2rem",
                      borderRadius: "14px",
                      boxShadow: "0 12px 28px -6px rgba(139, 92, 246, 0.5)",
                      boxSizing: "border-box",
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    ⚡ DOWNLOAD ANIME VOICE PACK NOW
                  </a>
                </div>
              )}

              {/* Security & 2-Hour Link Expiration Note */}
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  margin: "0 0 28px 0",
                  textAlign: "left",
                  color: "#92400e",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  lineHeight: "1.5",
                  boxShadow: "0 2px 8px rgba(245, 158, 11, 0.08)",
                }}
              >
                ⏳ <strong>Note:</strong> Your unique download link is active for <strong>2 hours</strong>. Please download your files promptly.
              </div>

              {/* Video Tutorial Card */}
              <div
                style={{
                  background: "#f1f5f9",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "28px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>
                  What to do next?
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#475569", margin: "0 0 16px 0", lineHeight: "1.5" }}>
                  Learn how to extract the samples, set up your audio soundboard, and send custom voice messages in WhatsApp & Discord!
                </p>
                <a
                  href="https://youtu.be/4AtRNQIbDmc"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    background: "#0f172a",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    borderRadius: "10px",
                  }}
                >
                  Watch the Video Tutorial Guide →
                </a>
              </div>

              {/* Return Home Link */}
              <div>
                <Link
                  href="/"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#64748b",
                    textDecoration: "none",
                  }}
                >
                  ← Return to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", backgroundColor: "#070a12", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
          Verifying order and preparing your download link...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
