"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

/**
 * PUBLIC_INTERFACE
 * Minimal accessible dialog (overlay + focus handling + ESC close).
 */
export default function Dialog({ open, title, children, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    // Focus the panel for basic keyboard flow
    setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="retro-card w-full max-w-xl p-4 md:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xl font-extrabold tracking-tight">
                {title}
              </div>
              <div className="text-sm text-[var(--color-muted)]">
                Press ESC to close.
              </div>
            </div>
            <button type="button" className="retro-btn" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="retro-divider my-4" />
          {children}
        </div>
      </div>
    </div>
  );
}
