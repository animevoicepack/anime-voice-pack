"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

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

export default function Navbar() {
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

  const handleScrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <div className="navbar-left">
          <a href="#" className="navbar-logo">
            <Image
              src="/logo.png"
              alt="Anime Voice Pack Bundle Logo"
              width={36}
              height={36}
              className="logo-img"
            />
            <div className="logo-text-container">
              <span className="logo-text">ANIME VOICE PACK</span>
              <span className="company-tag">Alpha Voice Assets LLC</span>
            </div>
          </a>

          {/* Top-Left Merged 75% Offer Badge with Day, Hour & Seconds */}
          <a
            href="#pricing"
            onClick={handleScrollToPricing}
            className="navbar-promo-badge"
            aria-label="Limited 75% Off Offer. Countdown displaying days, hours, and seconds."
          >
            <span className="nav-offer-tag">🔥 75% OFF</span>
            <span className="nav-offer-divider" aria-hidden="true" />
            <div className="nav-offer-timer">
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
                <span className="timer-num">{hasMounted ? formatNumber(timeLeft.seconds) : "59"}</span>
                <span className="timer-lbl">s</span>
              </span>
            </div>
          </a>
        </div>

        <div className="navbar-links">
          <a href="#overview" className="nav-link nav-link-desktop">Overview</a>
          <a href="#showcase" className="nav-link nav-link-desktop">Anime</a>
          <a href="#tutorial" className="nav-link nav-link-desktop">Tutorial</a>
          <a href="#pricing" onClick={handleScrollToPricing} className="nav-link btn-nav">
            BUY NOW
          </a>
        </div>
      </div>
    </nav>
  );
}
