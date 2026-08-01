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
import CheckoutModal from "../components/CheckoutModal";
import { policies, Policy } from "../data/policies";

export default function Home() {
  const [email, setEmail] = useState("");
  const [activePolicy, setActivePolicy] = useState<Policy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = (submittedEmail: string) => {
    if (submittedEmail) {
      setEmail(submittedEmail);
    }
    setIsCheckoutOpen(true);
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
        <Hero onBuyNow={() => setIsCheckoutOpen(true)} />
        
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
          isLoading={false}
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

      {/* Stripe Embedded Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        email={email}
      />
    </>
  );
}

