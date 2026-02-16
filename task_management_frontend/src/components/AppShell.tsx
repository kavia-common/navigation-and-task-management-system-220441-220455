"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * App-wide responsive layout shell with sidebar navigation and a top bar.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { href: "/", label: "Tasks", description: "Browse & manage tasks" },
      { href: "/labels", label: "Labels", description: "Organize with labels" },
      { href: "/activity", label: "Activity", description: "Live updates feed" },
      { href: "/settings", label: "Settings", description: "API & realtime" },
    ],
    []
  );

  const activeHref = navItems.find((n) => n.href === pathname)?.href;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-b-2 border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            className="retro-btn md:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            Menu
          </button>

          <div className="flex items-center gap-2">
            <div className="retro-badge bg-[color-mix(in_srgb,var(--color-primary),#fff_85%)]">
              Retro
            </div>
            <span className="font-extrabold tracking-tight text-lg">
              Retro Tasks
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link className="retro-btn" href="/">
              New Task
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-6">
          {/* Sidebar (desktop) */}
          <aside className="hidden md:block">
            <nav className="retro-card p-4">
              <div className="font-extrabold tracking-tight">Navigation</div>
              <div className="retro-divider my-3" />
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = item.href === activeHref;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={[
                          "block retro-card-sm px-3 py-2",
                          isActive
                            ? "bg-[color-mix(in_srgb,var(--color-accent),#fff_82%)]"
                            : "hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_90%)]",
                        ].join(" ")}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div className="font-bold">{item.label}</div>
                        <div className="text-sm text-[var(--color-muted)]">
                          {item.description}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[86%] max-w-sm bg-[var(--color-bg)] border-r-2 border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-extrabold text-lg">Navigation</div>
              <button
                type="button"
                className="retro-btn"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="retro-divider my-3" />

            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.href === activeHref;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        "block retro-card-sm px-3 py-2",
                        isActive
                          ? "bg-[color-mix(in_srgb,var(--color-accent),#fff_82%)]"
                          : "hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_90%)]",
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <div className="font-bold">{item.label}</div>
                      <div className="text-sm text-[var(--color-muted)]">
                        {item.description}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="retro-divider my-4" />
            <div className="text-sm text-[var(--color-muted)]">
              Tip: Use Settings to configure API/WS endpoints.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
