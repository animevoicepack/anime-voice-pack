"use client";

import React from "react";

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <h2 className="section-title">Why Choose Our Voice Pack Bundle?</h2>
        <p className="section-subtitle">
          Engineered from the ground up for high-fidelity sound, clean parodies, and immediate production use.
        </p>

        <div className="features-grid">
          {/* Pillar 1: Clean Isolated Audio */}
          <div className="glass-card feature-card pulsing-glow">
            <div className="feature-icon-container">
              <svg
                className="feature-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <h3 className="feature-card-title">Clean Isolated Audio</h3>
            <p className="feature-card-text">
              Every sample is edited to isolate the character&apos;s clean speaking voice. Background music, action sound effects, and ambient noises have been completely removed. This provides pure, clean audio files with maximum clarity and zero background noise artifacts, perfect for soundboards and video projects.
            </p>
            <div className="feature-tags">
              <span className="feature-tag">No BGM</span>
              <span className="feature-tag">High Fidelity</span>
              <span className="feature-tag">Pristine Audio</span>
            </div>
          </div>

          {/* Pillar 2: Multi-purpose Use */}
          <div className="glass-card feature-card pulsing-glow">
            <div className="feature-icon-container">
              <svg
                className="feature-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="feature-card-title">Multi-purpose Use</h3>
            <p className="feature-card-text">
              The possibilities are endless. These isolated samples are perfect for building unique Discord soundboards, mixing dynamic YouTube videos, creating engaging content for TikTok/Reels, or generating custom parodies. Use your favorite anime character voices to send hilarious, authentic custom WhatsApp voice messages that will leave your friends stunned.
            </p>
            <div className="feature-tags">
              <span className="feature-tag">WhatsApp Fun</span>
              <span className="feature-tag">Discord Soundboard</span>
              <span className="feature-tag">Content Creation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
