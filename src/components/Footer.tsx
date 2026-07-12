"use client";

import React from "react";

interface FooterProps {
  onOpenPolicy: (type: "terms" | "privacy" | "refund") => void;
}

export default function Footer({ onOpenPolicy }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer glass">
      <div className="container footer-container">
        {/* Logo and About block */}
        <div className="footer-brand">
          <h4 className="footer-logo-text">ANIME VOICE PACK</h4>
          <p className="footer-desc">
            Premium isolated voice datasets for soundboards, content creation, and messaging.
          </p>
        </div>

        {/* Links block */}
        <div className="footer-links-group">
          <div className="footer-links-col">
            <h5 className="links-col-title">Product</h5>
            <a href="#overview">Overview</a>
            <a href="#showcase">Characters</a>
            <a href="#tutorial">Tutorial</a>
            <a href="#pricing">Pricing</a>
          </div>

          <div className="footer-links-col">
            <h5 className="links-col-title">Legal</h5>
            <button onClick={() => onOpenPolicy("terms")} className="footer-link-btn">
              Terms of Service
            </button>
            <button onClick={() => onOpenPolicy("privacy")} className="footer-link-btn">
              Privacy Policy
            </button>
            <button onClick={() => onOpenPolicy("refund")} className="footer-link-btn">
              Refund Policy
            </button>
          </div>

          <div className="footer-links-col">
            <h5 className="links-col-title">Contact & Support</h5>
            <p className="support-email">
              ✉️ <a href="mailto:animevoicepack1@gmail.com">animevoicepack1@gmail.com</a>
            </p>
            <p className="support-hours">Response time: Under 24 hours</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright-text">
            © {currentYear} Anime Voice Pack Bundle. All rights reserved.
          </p>
          <p className="disclaimer-text">
            Disclaimer: Character names, posters, and reference audio are the property of their respective copyright owners. Audio samples are isolated for educational, parody, and creative usage under Fair Use guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}
