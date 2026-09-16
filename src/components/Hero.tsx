"use client";

import React, { useState, useEffect, useRef } from "react";

import PromoCountdownBadge from "./PromoCountdownBadge";

interface HeroProps {
  onBuyNow?: () => void;
}

export default function Hero({ onBuyNow }: HeroProps) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    function loadVideo() {
      const width = window.innerWidth;
      const isMobile = width <= 768;
      const expectedSrc = isMobile ? "/hero_section_9_16.mp4" : "/hero_section_16_9.mp4";
      setVideoSrc(expectedSrc);
    }

    loadVideo();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(loadVideo, 250);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented:", err);
      });
    }
  }, [videoSrc]);

  return (
    <header className="hero-section">
      {/* Background Video */}
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          id="bg-video"
          className="hero-video"
        />
      )}

      {/* Video Overlay Layer */}
      <div className="hero-overlay"></div>

      {/* Hero Content Grid */}
      <div className="hero-container container">
        <div className="hero-content">
          {/* Promotional Urgency Badge with Strikethrough Pricing & Evergreen Countdown */}
          <PromoCountdownBadge
            onClick={() => {
              if (onBuyNow) {
                onBuyNow();
              } else {
                const pricingSection = document.getElementById("pricing");
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
          />

          {/* Primary Headline in subtle dark container: bg-black/40 backdrop-blur-sm p-3 rounded-xl */}
          <div className="hero-title-box">
            <h1 className="hero-title">
              GET 1,000+ VOICE FILES OF EVERY ANIME CHARACTER&apos;S VOICE READY FOR AI VOICE CLONING
            </h1>
          </div>
          
          {/* Secondary Line: Featured Glassmorphism Pill Badge */}
          <div className="hero-feature-pill">
            <span className="pill-sparkle" aria-hidden="true">✨</span>
            <span className="pill-text">
              PERFECT FOR CONTENT CREATION AND VOICE MESSAGES USING ANIME CHARACTERS&apos; VOICES.
            </span>
          </div>

          <div className="hero-actions">
            <a
              href="#pricing"
              className="btn-primary hero-btn-buy"
              onClick={(e) => {
                e.preventDefault();
                if (onBuyNow) {
                  onBuyNow();
                } else {
                  const pricingSection = document.getElementById("pricing");
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
            >
              BUY NOW - $25
            </a>
            <a href="#showcase" className="btn-secondary hero-btn-series hero-btn-ghost">
              ANIME LIST
            </a>
          </div>

          <p className="hero-meta">
            🔒 Secure checkout via <span className="stripe-highlight">Stripe</span>. <span className="delivery-highlight">Delivery within minutes.</span>
          </p>
        </div>
      </div>
    </header>
  );
}
