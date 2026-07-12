"use client";

import React from "react";

export default function Overview() {
  return (
    <section id="overview" className="overview-section">
      <div className="container">
        <div className="overview-grid">
          {/* Text Content */}
          <div className="overview-info">
            <div className="badge">PRODUCT OVERVIEW</div>
            <h2 className="overview-title">
              Studio-Grade Anime Vocal Samples Optimized for AI Cloning
            </h2>
            <p className="overview-text">
              The <strong>Anime Voice Pack Bundle</strong> is a premium, meticulously curated collection of over <strong>1,000+ high-fidelity voice files</strong>. Sourced from 16+ of the most iconic anime series, every track has been professionally isolated and completely stripped of background music and noise to ensure absolute acoustic purity.
            </p>
            <p className="overview-text">
              All audio files are provided strictly in industry-standard <strong>MP3 format</strong>, pre-sliced and organized into clearly labeled directories. This makes them <strong>100% ready for training advanced AI voice models, audio engineering, and professional content creation</strong>.
            </p>
            <p className="overview-text highlight-box">
              💬 <strong>WhatsApp voice messages for friends:</strong> Use these flawless character voice samples after cloning to send custom, authentic-sounding audio messages and completely shock your friends in your WhatsApp chats!
            </p>
          </div>

          {/* Graphic/Data Presentation */}
          <div className="overview-stats-card glass pulsing-glow">
            <h3 className="stats-card-title">Bundle Statistics</h3>
            
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Isolated Audio Samples</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">16+</span>
                <span className="stat-label">Anime Series Covered</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">MP3</span>
                <span className="stat-label">Format (Clean & Normalized)</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Isolated Clean Audio</span>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
