"use client";

import React, { useState, useEffect, useRef } from "react";

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
          {/* Restored Stylized Main Title */}
          <h1 className="hero-title">
            <span className="hero-title-main">ANIME VOICE PACK</span>{" "}
            <span className="hero-title-sub highlight-yellow">BUNDLE</span>
          </h1>

          {/* Enhanced Glass Container & High-Tech Value Proposition */}
          <div className="hero-value-box">
            <p className="hero-value-text">
              GET <span className="text-red-500 font-extrabold">1,000+ VOICE FILES</span> OF EVERY ANIME CHARACTER&apos;S VOICE, <span className="text-emerald-400 font-extrabold">FULLY CLEANED</span> AND READY FOR <span className="text-cyan-400 font-extrabold">AI VOICE CLONING</span>
            </p>
          </div>
          
          {/* Electric Violet Pill Badge with Live Ambient Animation */}
          <div className="hero-electric-pill">
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
              BUY NOW
            </a>
            <a href="#showcase" className="btn-secondary hero-btn-series hero-btn-ghost">
              ANIME LIST
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
