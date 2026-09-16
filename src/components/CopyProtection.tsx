"use client";

import { useEffect } from "react";

/**
 * CopyProtection component
 * Prevents unauthorized copying of website text, images, and media:
 * - Blocks mouse text selection and double-click highlights
 * - Blocks context menu (right-click) across the page
 * - Blocks clipboard copy and cut actions
 * - Blocks keyboard shortcuts (Ctrl/Cmd + C, X, A, U, S, P)
 * - Blocks dragging images, links, and text
 * 
 * Safely preserves input fields (email, checkout forms) so user interaction is never broken.
 */
export default function CopyProtection() {
  useEffect(() => {
    // Prevent right click / context menu
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
    };

    // Prevent clipboard copy
    const handleCopy = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
    };

    // Prevent clipboard cut
    const handleCut = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
    };

    // Prevent text selection start
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
    };

    // Clear any text selection if it happens
    const handleSelectionChange = () => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        selection.removeAllRanges();
      }
    };

    // Prevent dragging images, links, or text
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
    };

    // Prevent copy/cut/select-all/view-source keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");

      if (isInput) {
        return; // Allow standard input interactions
      }

      if (isCtrlOrCmd) {
        const key = e.key.toLowerCase();
        if (
          key === "c" || // Copy
          key === "x" || // Cut
          key === "a" || // Select All
          key === "u" || // View Source
          key === "s" || // Save Page
          key === "p"    // Print
        ) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
