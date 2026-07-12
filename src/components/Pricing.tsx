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
      setError("Email address is required to dispatch the secure link.");
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
    <section id="pricing" className="pricing-section">
      <div className="container">
        <h2 className="section-title">Get Instant Access Now</h2>
        <p className="section-subtitle">
          Get your premium voice pack bundle today at a limited-time 50% discount.
        </p>

        <div className="pricing-card-container">
          <div className="pricing-card glass pulsing-glow">
            {/* Discount Ribbon */}
            <div className="pricing-ribbon">50% OFF</div>
            
            <div className="pricing-header">
              <span className="badge">Limited Time Offer</span>
              <h3 className="product-name">Anime Voice Pack Bundle</h3>
              <p className="product-files-count">1,000+ Clean Audio Samples</p>
            </div>

            {/* Price Container */}
            <div className="price-container">
              <span className="original-price">$100</span>
              <span className="current-price">$50</span>
              <span className="price-period">One-time payment</span>
            </div>

            {/* Included Features Checklist */}
            <ul className="pricing-features">
              <li>
                <span className="check-icon">✓</span>
                <span>1000+ ultra-clear voice files/samples</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Perfectly isolated & normalized MP3 files</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Sorted across 16+ Anime series</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>100% ready for Discord soundboards, content edits, and parodies</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Perfect for custom WhatsApp voice messages & Discord sounds</span>
              </li>
            </ul>

            {/* Purchase Form */}
            <form onSubmit={handleCheckoutClick} className="pricing-form">
              <label className="form-label" htmlFor="pricing-email">
                Delivery Email Address:
              </label>
              
              <div className="input-group">
                <input
                  id="pricing-email"
                  type="email"
                  placeholder="Enter your email to receive your secure download link"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={`email-input ${error ? "input-error" : ""}`}
                  disabled={isLoading}
                />
                {error && <span className="error-message">{error}</span>}
              </div>

              <button type="submit" className="btn-primary checkout-btn" disabled={isLoading}>
                {isLoading ? "Redirecting to checkout..." : "Proceed to Secure Stripe Checkout"}
              </button>
            </form>

            {/* Security Disclaimer */}
            <p className="security-note">
              🔒 <strong>Important:</strong> Your unique, secure download link is generated via Cloudflare R2 and dispatched immediately via Resend to your provided email address after payment. For security reasons, the download link remains active for exactly 1 hour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
