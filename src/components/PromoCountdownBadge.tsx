"use client";

import React, { useState, useEffect } from "react";

interface PromoCountdownBadgeProps {
  onClick?: () => void;
}

const STORAGE_KEY = "anime_voice_pack_countdown_target";
const CYCLE_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

export default function PromoCountdownBadge({ onClick }: PromoCountdownBadgeProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    setHasMounted(true);

    const getInitialTarget = (): number => {
      const now = Date.now();
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = parseInt(stored, 10);
          // If stored timestamp is valid and still in the future, use it
          if (!isNaN(parsed) && parsed > now) {
            return parsed;
          }
        }
      } catch {
        // Fallback if localStorage is inaccessible
      }

      // If expired, not found, or invalid, initialize fresh 48-hour loop
      const newTarget = now + CYCLE_DURATION_MS;
      try {
        localStorage.setItem(STORAGE_KEY, newTarget.toString());
      } catch {}
      return newTarget;
    };

    let targetTimestamp = getInitialTarget();

    const calculateAndUpdate = () => {
      const now = Date.now();
      let diff = targetTimestamp - now;

      // Evergreen loop: when timer reaches 0, loop back to fresh 48-hour cycle
      if (diff <= 0) {
        targetTimestamp = now + CYCLE_DURATION_MS;
        try {
          localStorage.setItem(STORAGE_KEY, targetTimestamp.toString());
        } catch {}
        diff = targetTimestamp - now;
      }

      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateAndUpdate();
    const interval = setInterval(calculateAndUpdate, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    return String(num).padStart(2, "0");
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="hero-promo-badge-wrapper">
      <a
        href="#pricing"
        onClick={handleClick}
        className="hero-promo-badge"
        aria-label="Launch Offer: 75% OFF. Original price $100, current price $25 USD. Limited 48-hour countdown."
      >
        {/* Launch Offer Badge */}
        <div className="promo-badge-tag">
          <span className="promo-badge-fire" aria-hidden="true">🔥</span>
          <span className="promo-badge-offer-text">Launch Offer - 75% OFF</span>
        </div>

        <span className="promo-badge-divider" aria-hidden="true" />

        {/* Anchor Pricing */}
        <div className="promo-badge-pricing">
          <span className="promo-price-old">~~$100~~</span>
          <span className="promo-price-current">$25 USD</span>
        </div>

        <span className="promo-badge-divider" aria-hidden="true" />

        {/* Evergreen Looped Countdown Display (DD : HH : MM : SS) */}
        <div className="promo-badge-timer" title="Evergreen countdown loop active">
          <span className="promo-timer-icon" aria-hidden="true">⏳</span>
          <div className="promo-timer-units">
            <span className="timer-unit">
              <span className="timer-num">{hasMounted ? formatNumber(timeLeft.days) : "01"}</span>
              <span className="timer-lbl">d</span>
            </span>
            <span className="timer-sep">:</span>
            <span className="timer-unit">
              <span className="timer-num">{hasMounted ? formatNumber(timeLeft.hours) : "23"}</span>
              <span className="timer-lbl">h</span>
            </span>
            <span className="timer-sep">:</span>
            <span className="timer-unit">
              <span className="timer-num">{hasMounted ? formatNumber(timeLeft.minutes) : "59"}</span>
              <span className="timer-lbl">m</span>
            </span>
            <span className="timer-sep">:</span>
            <span className="timer-unit">
              <span className="timer-num">{hasMounted ? formatNumber(timeLeft.seconds) : "59"}</span>
              <span className="timer-lbl">s</span>
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
