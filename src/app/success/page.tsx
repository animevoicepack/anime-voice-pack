import React from "react";
import Link from "next/link";
export const runtime = 'edge';

interface SuccessPageProps {
  searchParams: Promise<{ email?: string; session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const email = params.email ? decodeURIComponent(params.email) : "";

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
      <div style={{ maxWidth: "620px", width: "100%" }}>
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
          {/* Animated Green Checkmark Badge */}
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 24px auto",
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
            ✓ Payment Confirmed
          </div>

          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", margin: "0 0 12px 0" }}>
            Order Confirmed! 🎉
          </h1>

          <p style={{ fontSize: "1.05rem", color: "#334155", lineHeight: "1.6", margin: "0 0 24px 0" }}>
            Thank you for your purchase! Your <strong>ANIME VOICE PACK</strong> download link has been generated and dispatched to your email address{email ? <> (<strong style={{ color: "#7c3aed" }}>{email}</strong>)</> : ""}.
          </p>

          {/* Prominent Spam / Inbox Notice Box */}
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "14px",
              padding: "16px 20px",
              margin: "0 0 20px 0",
              textAlign: "left",
              color: "#92400e",
              fontSize: "0.9375rem",
              fontWeight: 600,
              lineHeight: "1.5",
              boxShadow: "0 2px 8px rgba(245, 158, 11, 0.08)",
            }}
          >
            💡 Didn't see your download email yet? Please check your Spam / Junk folder or Promotions tab.
          </div>

          {/* Security / 2-Hour Expiration Box */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "12px 16px",
              margin: "0 0 32px 0",
              fontSize: "0.84rem",
              color: "#475569",
              fontWeight: 500,
            }}
          >
            ⏳ <strong>Note:</strong> For security and bandwidth protection, your download link remains active for <strong>2 hours</strong>. Please download your package promptly.
          </div>

          {/* Tutorial Card / Call to Action */}
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
              Watch the Video Tutorial Guide →
            </a>
          </div>

          {/* Return Home Button */}
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
      </div>
    </main>
  );
}
