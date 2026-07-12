"use client";

import React from "react";
import Image from "next/image";

interface SeriesItem {
  name: string;
  posters: string[];
  lang: string;
}

const seriesList: SeriesItem[] = [
  {
    name: "THE SEVEN DEADLY SINS",
    posters: ["/posters/the-seven-deadly-sins.jpg"],
    lang: "JP ONLY",
  },
  {
    name: "ONE PIECE",
    posters: ["/posters/one-piece.jpeg"],
    lang: "JP ONLY",
  },
  {
    name: "JOJO'S BIZARRE ADVENTURE",
    posters: ["/posters/jojos-bizarre-adventure.jpg"],
    lang: "JP ONLY",
  },
  {
    name: "NARUTO & BORUTO",
    posters: ["/posters/naruto.jpg", "/posters/boruto.jpg"],
    lang: "JP ONLY",
  },
  {
    name: "HAJIME NO IPPO",
    posters: ["/posters/hajime-no-ippo.jpg"],
    lang: "JP ONLY",
  },
  {
    name: "DRAGON BALL",
    posters: ["/posters/dragon-ball.jpg"],
    lang: "EN & JP",
  },
  {
    name: "ATTACK ON TITAN",
    posters: ["/posters/attack-on-titan.jpg"],
    lang: "JP ONLY",
  },
  {
    name: "BLEACH",
    posters: ["/posters/bleach.jpg"],
    lang: "JP ONLY",
  },
  {
    name: "DEMON SLAYER",
    posters: ["/posters/demon-slayer.jpg"],
    lang: "EN & JP",
  },
  {
    name: "HUNTER X HUNTER",
    posters: ["/posters/hunter-x-hunter.jpg"],
    lang: "JP ONLY",
  },
  {
    name: "SOLO LEVELING",
    posters: ["/posters/solo-leveling.jpg"],
    lang: "EN & JP",
  },
  {
    name: "MY HERO ACADEMIA",
    posters: ["/posters/my-hero-academia.jpg"],
    lang: "EN & JP",
  },
  {
    name: "BLUE LOCK",
    posters: ["/posters/blue-lock.jpg"],
    lang: "JP ONLY",
  },
  {
    name: "JUJUTSU KAISEN",
    posters: ["/posters/jujutsu-kaisen.jpg"],
    lang: "EN & JP",
  },
  {
    name: "ONE PUNCH MAN",
    posters: ["/posters/one-punch-man.jpg"],
    lang: "EN & JP",
  },
  {
    name: "ADDITIONAL CHARACTERS",
    posters: [""], // Image deleted, using custom CSS placeholder
    lang: "EN & JP",
  },
];

export default function Showcase() {
  // Render a single showcase card
  const renderCard = (series: SeriesItem, keyId: string) => {
    const isSplit = series.posters.length > 1;
    const isAdditional = series.name === "ADDITIONAL CHARACTERS";

    return (
      <div key={keyId} className="showcase-card glass-card pulse-border">
        {/* Poster Image Container */}
        <div className="poster-container">
          {isAdditional ? (
            /* Custom CSS Placeholder for Additional Characters */
            <div className="additional-chars-placeholder">
              <span className="plus-icon">+</span>
              <span className="placeholder-text">10+ MORE SERIES</span>
            </div>
          ) : isSplit ? (
            /* Split layout for Naruto/Boruto */
            <div className="split-poster">
              {series.posters.map((img, i) => (
                <div key={i} className="split-half">
                  <Image
                    src={img}
                    alt={`${series.name} cover ${i + 1}`}
                    fill
                    sizes="200px"
                    className="poster-img"
                  />
                </div>
              ))}
            </div>
          ) : (
            <Image
              src={series.posters[0]}
              alt={`${series.name} cover`}
              fill
              sizes="200px"
              className="poster-img"
            />
          )}
          {/* Subtle dark gradient overlay */}
          <div className="poster-gradient"></div>

          {/* Audio wave dynamic micro-animation on hover */}
          <div className="audio-wave-animation">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Language Badge */}
          <span className={`lang-badge ${series.lang.includes("EN") ? "badge-multi" : "badge-jp"}`}>
            {series.lang}
          </span>
        </div>

        {/* Card Info */}
        <div className="card-info">
          <h3 className="series-name">{series.name}</h3>
        </div>
      </div>
    );
  };

  return (
    <section id="showcase" className="showcase-section">
      <div className="container">
        <h2 className="section-title">Included Anime Series</h2>
        <p className="section-subtitle">
          Explore the massive collection of pristine voice clips covering your favorite characters. Drag or hover to pause the marquee scroll.
        </p>
      </div>

      {/* Infinite Looping Marquee container */}
      <div className="marquee-container">
        <div className="marquee-track">
          {/* First loop of posters */}
          {seriesList.map((series, idx) => renderCard(series, `loop1-${idx}`))}
          {/* Second loop of posters for seamless infinite wrap */}
          {seriesList.map((series, idx) => renderCard(series, `loop2-${idx}`))}
        </div>
      </div>
    </section>
  );
}
