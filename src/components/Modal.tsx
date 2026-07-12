"use client";

import React, { useEffect } from "react";
import { Policy } from "../data/policies";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: Policy | null;
}

export default function Modal({ isOpen, onClose, policy }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !policy) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass pulsing-glow" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{policy.title}</h2>
            <p className="modal-subtitle">Last updated: {policy.lastUpdated}</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {policy.content.map((paragraph, index) => (
            <p key={index} className="modal-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
}
