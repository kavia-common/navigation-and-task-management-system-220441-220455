"use client";

import { getApiBaseUrl, getWsUrl } from "@/lib/config";
import React, { useMemo } from "react";

export default function SettingsPage() {
  const api = useMemo(() => getApiBaseUrl(), []);
  const ws = useMemo(() => getWsUrl(), []);

  return (
    <section className="space-y-4">
      <div className="retro-card p-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Configure backend REST + realtime endpoints for this frontend.
        </p>
      </div>

      <div className="retro-card p-4 space-y-3">
        <div className="font-extrabold">Environment variables</div>
        <div className="retro-divider" />

        <div className="retro-card-sm p-3">
          <div className="font-bold">NEXT_PUBLIC_API_BASE_URL</div>
          <div className="text-sm text-[var(--color-muted)]">
            Base URL for REST calls to the backend, e.g.{" "}
            <span className="font-mono">https://…:3001</span>
          </div>
        </div>

        <div className="retro-card-sm p-3">
          <div className="font-bold">NEXT_PUBLIC_WS_URL</div>
          <div className="text-sm text-[var(--color-muted)]">
            WebSocket URL for realtime updates, e.g.{" "}
            <span className="font-mono">wss://…:3001/ws</span>
          </div>
        </div>

        <div className="retro-divider" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="retro-card-sm p-3">
            <div className="text-sm text-[var(--color-muted)]">Derived API</div>
            <div className="font-mono break-all">{api || "(same-origin / local fallback)"}</div>
          </div>
          <div className="retro-card-sm p-3">
            <div className="text-sm text-[var(--color-muted)]">Derived WS</div>
            <div className="font-mono break-all">{ws}</div>
          </div>
        </div>

        <div className="retro-card-sm p-3 bg-[color-mix(in_srgb,var(--color-accent),#fff_88%)]">
          <div className="font-bold">Note</div>
          <div className="text-sm">
            The backend OpenAPI spec available in this environment currently only
            includes a health endpoint, so the UI uses a local-storage fallback
            task dataset. Once task endpoints are exposed, wire them in{" "}
            <span className="font-mono">src/lib/taskApi.ts</span>.
          </div>
        </div>
      </div>
    </section>
  );
}
