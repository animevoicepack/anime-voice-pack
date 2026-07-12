"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Hero() {
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
          id="bg-video"
          className="hero-video"
        />
      )}

      {/* Video Overlay Layer */}
      <div className="hero-overlay"></div>

      {/* Hero Content Grid */}
      <div className="hero-container container">
        <div className="hero-content">
          <h1 className="hero-title">
            ANIME VOICE PACK <span className="highlight">BUNDLE</span>
          </h1>
          
          <p className="hero-subtitle">
            Get <span className="highlight-cyan">1000+</span> ultra-clear voice files/samples from <span className="highlight-orange">16+ anime series</span>, optimized for <span className="highlight-yellow">Ai voice clone</span> & <span className="highlight-green">WhatsApp messaging</span>.
          </p>

          <div className="hero-actions">
            <a href="#pricing" className="btn-primary hero-btn-buy">
              Buy Now
            </a>
            <a href="#showcase" className="btn-secondary hero-btn-series">
              Anime List
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
