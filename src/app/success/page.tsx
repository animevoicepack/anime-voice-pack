import React from "react";
import Link from "next/link";
import Image from "next/image";

export const runtime = "edge";

interface SuccessPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const email = params.email ? decodeURIComponent(params.email) : "";

  return (
    <main className="success-layout">
      {/* Background decoration glow */}
      <div className="success-glow"></div>

      <div className="container success-container">
        <div className="success-card glass pulsing-glow">
          {/* Logo */}
          <div className="success-logo">
            <Image
              src="/logo.png"
              alt="Anime Voice Pack Bundle Logo"
              width={50}
              height={50}
            />
            <span className="success-logo-text">ANIME VOICE PACK</span>
          </div>

          {/* Success Checkmark Circle */}
          <div className="success-checkmark-wrapper">
            <div className="success-checkmark-circle">
              <svg
                className="checkmark-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank you Message Block */}
          <h1 className="success-title">Order Confirmed!</h1>
          
          <div className="success-message-container">
            <p className="success-msg-main">
              Thank you for your purchase! Your secure download link has been generated and sent to{" "}
              {email ? <strong className="success-email-highlight">{email}</strong> : "your email"}.
            </p>
            <p className="success-msg-sub">
              Please check your inbox (including your spam or promotions folder).
            </p>
          </div>

          {/* Time Limit Notice */}
          <div className="time-warning-box">
            <span className="warning-icon">⏳</span>
            <span className="warning-text">
              Note: The download link is generated via Cloudflare R2 and Resend and is valid for <strong>1 hour only</strong>. Please download your package immediately.
            </span>
          </div>

          {/* Watch Tutorial card/frame */}
          <div className="tutorial-redirect-card">
            <h3 className="redirect-card-title">What to do next?</h3>
            <p className="redirect-card-desc">
              Learn how to import the samples, configure your soundboard, and start sending messages on WhatsApp!
            </p>
            
            {/* Highly visible watch button */}
            <a
              href="[YOUTUBE_URL_PLACEHOLDER]"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary success-watch-btn"
            >
              Watch the Tutorial Guide
            </a>
          </div>

          {/* Link back home */}
          <div className="success-back-home">
            <Link href="/" className="back-link">
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
