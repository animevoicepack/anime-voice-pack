"use client";

import React, { useState } from "react";

export default function Tutorial() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
    // Since it's a placeholder link, we can also open it in a new window or render the iframe
    // In production, we'd render the iframe:
    // window.open('https://youtu.be/4AtRNQIbDmc', '_blank');
  };

  return (
    <section id="tutorial" className="tutorial-section">
      <div className="container">
        <h2 className="section-title">Video Tutorial & Explainer</h2>
        <p className="section-subtitle">
          See the voice pack in action! Watch our step-by-step tutorial guide on how to import, play, and send authentic custom voice messages in minutes.
        </p>

        <div className="video-player-container glass pulsing-glow">
          {!isPlaying ? (
            /* Custom Video Poster */
            <div className="video-poster" onClick={handlePlayClick}>
              {/* Animated Glowing Play Button */}
              <div className="play-button-outer">
                <div className="play-button-inner">
                  <svg
                    className="play-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="video-title-overlay">
                <h3>Voice Pack Tutorial & Showcase</h3>
                <p>Click to watch the full explainer</p>
              </div>
            </div>
          ) : (
            /* YouTube Iframe Embed */
            <div className="video-iframe-wrapper">
              <iframe
                src="https://www.youtube.com/embed/4AtRNQIbDmc?autoplay=1"
                title="Anime Voice Pack Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-iframe"
              ></iframe>
              <div className="iframe-placeholder-info">
                <span>Watch on YouTube: <a href="https://youtu.be/4AtRNQIbDmc" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>youtu.be/4AtRNQIbDmc</a></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
