"use client";

import { useTaskRealtime } from "@/hooks/useTaskRealtime";
import { useTasks } from "@/hooks/useTasks";
import React, { useMemo } from "react";

export default function LabelsPage() {
  const { lastEvent, status } = useTaskRealtime();
  const { allTasks, labels } = useTasks(lastEvent);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    allTasks.forEach((t) => t.labels.forEach((l) => map.set(l, (map.get(l) ?? 0) + 1)));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [allTasks]);

  return (
    <section className="space-y-4">
      <div className="retro-card p-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Labels</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Quick overview of labels in use. Realtime: {status}.
        </p>
      </div>

      <div className="retro-card p-4">
        <div className="font-extrabold">All labels</div>
        <div className="retro-divider my-3" />

        {labels.length === 0 ? (
          <div className="retro-card-sm p-3">
            <div className="font-bold">No labels yet</div>
            <div className="text-sm text-[var(--color-muted)]">
              Add labels when creating/editing tasks.
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {counts.map(([label, count]) => (
              <span
                key={label}
                className="retro-badge bg-[color-mix(in_srgb,var(--color-accent),#fff_90%)]"
              >
                {label} ({count})
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
