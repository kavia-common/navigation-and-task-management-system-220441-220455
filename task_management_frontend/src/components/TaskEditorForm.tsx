"use client";

import React, { useMemo, useState } from "react";
import type { Task, TaskPriority, TaskStatus, TaskUpsert } from "@/lib/types";

type Props = {
  initial?: Task | null;
  availableLabels: string[];
  onSubmit: (payload: TaskUpsert) => Promise<void> | void;
  submitLabel: string;
};

/**
 * PUBLIC_INTERFACE
 * Controlled form for creating/editing a task.
 */
export default function TaskEditorForm({
  initial,
  availableLabels,
  onSubmit,
  submitLabel,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? "todo");
  const [priority, setPriority] = useState<TaskPriority>(
    initial?.priority ?? "medium"
  );
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [labelsText, setLabelsText] = useState(
    (initial?.labels ?? []).join(", ")
  );
  const [error, setError] = useState<string>("");

  const suggestions = useMemo(() => availableLabels.slice(0, 8), [availableLabels]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Title is required.");
      return;
    }

    const labels = labelsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setError("");
    await onSubmit({
      title: trimmed,
      description,
      status,
      priority,
      dueDate,
      labels,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error ? (
        <div className="retro-card-sm p-3 bg-[color-mix(in_srgb,var(--color-danger),#fff_85%)]">
          <div className="font-bold">Fix this</div>
          <div className="text-sm">{error}</div>
        </div>
      ) : null}

      <label className="block">
        <div className="font-bold mb-1">Title</div>
        <input
          className="retro-input w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Ship the retro UI"
        />
      </label>

      <label className="block">
        <div className="font-bold mb-1">Description</div>
        <textarea
          className="retro-card-sm w-full p-3 min-h-[110px] resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What needs to be done?"
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block">
          <div className="font-bold mb-1">Status</div>
          <select
            className="retro-select w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className="block">
          <div className="font-bold mb-1">Priority</div>
          <select
            className="retro-select w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="block">
          <div className="font-bold mb-1">Due date</div>
          <input
            className="retro-input w-full"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </label>
      </div>

      <label className="block">
        <div className="font-bold mb-1">Labels (comma-separated)</div>
        <input
          className="retro-input w-full"
          value={labelsText}
          onChange={(e) => setLabelsText(e.target.value)}
          placeholder="ui, backend, urgent"
          list="label-suggestions"
        />
        <datalist id="label-suggestions">
          {suggestions.map((l) => (
            <option key={l} value={l} />
          ))}
        </datalist>
        <div className="text-sm text-[var(--color-muted)] mt-1">
          Tip: try labels like <span className="font-semibold">ui</span>,{" "}
          <span className="font-semibold">realtime</span>,{" "}
          <span className="font-semibold">bug</span>.
        </div>
      </label>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="submit"
          className="retro-btn bg-[color-mix(in_srgb,var(--color-secondary),#fff_82%)]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
