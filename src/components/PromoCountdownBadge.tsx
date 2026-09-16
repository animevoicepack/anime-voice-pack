"use client";

import React, { useState, useEffect } from "react";

interface PromoCountdownBadgeProps {
  onClick?: () => void;
}

const CYCLE_DURATION = 48 * 60 * 60 * 1000; // 48 hours in ms

const calculateTimeLeft = () => {
  const timeLeftMs = CYCLE_DURATION - (Date.now() % CYCLE_DURATION);
  const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
};

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
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

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
        aria-label="Limited Offer: 75% OFF. Original price $100, current price $25 USD. Limited 48-hour countdown."
      >
        {/* Limited Offer Badge */}
        <div className="promo-badge-tag">
          <span className="promo-badge-fire" aria-hidden="true">🔥</span>
          <span className="promo-badge-offer-text">LIMITED OFFER - 75% OFF</span>
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
