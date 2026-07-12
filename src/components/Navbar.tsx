"use client";

import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <a href="#" className="navbar-logo">
          <Image
            src="/logo.png"
            alt="Anime Voice Pack Bundle Logo"
            width={40}
            height={40}
            className="logo-img"
          />
          <span className="logo-text">ANIME VOICE PACK</span>
        </a>

        <div className="navbar-links">
          <a href="#overview" className="nav-link">Overview</a>
          <a href="#showcase" className="nav-link">Anime</a>
          <a href="#tutorial" className="nav-link">Tutorial</a>
          <a href="#pricing" className="nav-link btn-nav">Buy Now</a>
        </div>
      </div>
    </nav>
  );
}
