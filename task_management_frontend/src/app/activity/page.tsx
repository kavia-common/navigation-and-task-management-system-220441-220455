"use client";

import { useTaskRealtime } from "@/hooks/useTaskRealtime";
import React, { useEffect, useState } from "react";
import type { RealtimeEvent } from "@/lib/types";

export default function ActivityPage() {
  const { status, lastEvent } = useTaskRealtime();
  const [events, setEvents] = useState<RealtimeEvent[]>([]);

  useEffect(() => {
    if (!lastEvent) return;
    setEvents((prev) => [lastEvent, ...prev].slice(0, 20));
  }, [lastEvent]);

  return (
    <section className="space-y-4">
      <div className="retro-card p-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Activity</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Live event feed for task changes. Connection: {status}.
        </p>
      </div>

      <div className="retro-card p-4">
        <div className="font-extrabold">Latest events</div>
        <div className="retro-divider my-3" />

        {events.length === 0 ? (
          <div className="retro-card-sm p-3">
            <div className="font-bold">No events yet</div>
            <div className="text-sm text-[var(--color-muted)]">
              If your backend WS is running, create/edit tasks to see events.
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {events.map((e, idx) => (
              <li key={idx} className="retro-card-sm p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="retro-badge">{e.type}</span>
                  <span className="text-sm text-[var(--color-muted)]">
                    #{idx + 1}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  {"message" in e ? e.message : null}
                  {"task" in e ? (
                    <div className="mt-1">
                      <div className="font-bold">{e.task.title}</div>
                      <div className="text-[var(--color-muted)]">
                        {e.task.status} · {e.task.priority}
                      </div>
                    </div>
                  ) : null}
                  {"taskId" in e ? (
                    <div className="mt-1">
                      Deleted taskId: <span className="font-mono">{e.taskId}</span>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
