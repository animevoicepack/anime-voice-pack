"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Overview from "../components/Overview";
import Features from "../components/Features";
import Showcase from "../components/Showcase";
import Tutorial from "../components/Tutorial";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import { policies, Policy } from "../data/policies";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activePolicy, setActivePolicy] = useState<Policy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckout = async (submittedEmail: string) => {
    setIsLoading(true);
    try {
      // Sync local email state in case checkout was triggered from Hero
      setEmail(submittedEmail);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: submittedEmail }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Securely redirect to the returned Stripe URL (or simulated local success page)
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Stripe initiation failed:", err);
      alert("Secure connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPolicy = (type: "terms" | "privacy" | "refund") => {
    setActivePolicy(policies[type]);
    setIsModalOpen(true);
  };

  const handleClosePolicy = () => {
    setIsModalOpen(false);
    setActivePolicy(null);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh" }}>
        {/* Hero Section with main headings and scroll action buttons */}
        <Hero />
        
        {/* Product specs, isolated samples, parodies, WhatsApp usage */}
        <Overview />
        
        {/* Dual pillars: Clean audio specs and multi-purpose sounds */}
        <Features />
        
        {/* 16 character poster grid showcase */}
        <Showcase />
        
        {/* Explainer video tutorials */}
        <Tutorial />
        
        {/* 50% pricing promotion card with second validated email block */}
        <Pricing
          email={email}
          setEmail={setEmail}
          onCheckout={handleCheckout}
          isLoading={isLoading}
        />
      </main>
      
      {/* Footer copyright, contact support and policy callbacks */}
      <Footer onOpenPolicy={handleOpenPolicy} />
      
      {/* Custom modal overlays for legal documentation */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClosePolicy}
        policy={activePolicy}
      />
    </>
  );
}
