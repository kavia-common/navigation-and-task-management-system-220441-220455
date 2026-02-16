"use client";

import Dialog from "@/components/Dialog";
import TaskEditorForm from "@/components/TaskEditorForm";
import { useTaskRealtime } from "@/hooks/useTaskRealtime";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/lib/types";
import React, { useMemo, useState } from "react";

export default function Home() {
  const { status: rtStatus, lastEvent } = useTaskRealtime();
  const {
    loading,
    error,
    tasks,
    allTasks,
    selectedTask,
    selectedTaskId,
    setSelectedTaskId,
    filters,
    setFilters,
    labels,
    onCreate,
    onUpdate,
    onDelete,
  } = useTasks(lastEvent);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const selectedIndex = useMemo(
    () => tasks.findIndex((t) => t.id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  function pillColor(t: Task) {
    if (t.status === "done") return "bg-[color-mix(in_srgb,var(--color-secondary),#fff_84%)]";
    if (t.status === "in_progress") return "bg-[color-mix(in_srgb,var(--color-primary),#fff_86%)]";
    return "bg-[color-mix(in_srgb,var(--color-accent),#fff_86%)]";
  }

  return (
    <section className="space-y-4">
      <div className="retro-card p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Tasks
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              Filters + search, list + details, and realtime updates ({rtStatus}).
            </p>
          </div>

          <div className="md:ml-auto flex items-center gap-2">
            <button
              type="button"
              className="retro-btn bg-[color-mix(in_srgb,var(--color-primary),#fff_85%)]"
              onClick={() => setCreateOpen(true)}
            >
              Create
            </button>
            {selectedTask ? (
              <button
                type="button"
                className="retro-btn bg-[color-mix(in_srgb,var(--color-accent),#fff_82%)]"
                onClick={() => setEditOpen(true)}
              >
                Edit
              </button>
            ) : null}
          </div>
        </div>

        <div className="retro-divider my-4" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <label className="block lg:col-span-2">
            <div className="font-bold mb-1">Search</div>
            <input
              className="retro-input w-full"
              value={filters.query}
              onChange={(e) =>
                setFilters((p) => ({ ...p, query: e.target.value }))
              }
              placeholder="Search title, description, labels…"
            />
          </label>

          <label className="block">
            <div className="font-bold mb-1">Status</div>
            <select
              className="retro-select w-full"
              value={filters.status}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  status: e.target.value as typeof filters.status,
                }))
              }
            >
              <option value="all">All</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label className="block">
            <div className="font-bold mb-1">Priority</div>
            <select
              className="retro-select w-full"
              value={filters.priority}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  priority: e.target.value as typeof filters.priority,
                }))
              }
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="block lg:col-span-2">
            <div className="font-bold mb-1">Label</div>
            <select
              className="retro-select w-full"
              value={filters.label}
              onChange={(e) =>
                setFilters((p) => ({ ...p, label: e.target.value }))
              }
            >
              <option value="">All labels</option>
              {labels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>

          <div className="lg:col-span-2 flex items-end gap-2">
            <button
              type="button"
              className="retro-btn"
              onClick={() =>
                setFilters({ query: "", status: "all", label: "", priority: "all" })
              }
            >
              Clear
            </button>
            <div className="text-sm text-[var(--color-muted)] ml-auto">
              Showing <span className="font-bold">{tasks.length}</span> /{" "}
              <span className="font-bold">{allTasks.length}</span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-4 retro-card-sm p-3 bg-[color-mix(in_srgb,var(--color-danger),#fff_85%)]">
            <div className="font-bold">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        ) : null}

        {lastEvent?.type === "error" ? (
          <div className="mt-4 retro-card-sm p-3 bg-[color-mix(in_srgb,var(--color-danger),#fff_85%)]">
            <div className="font-bold">Realtime</div>
            <div className="text-sm">{lastEvent.message}</div>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        {/* List */}
        <div className="retro-card p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="font-extrabold tracking-tight">Task list</div>
            {loading ? (
              <span className="text-sm text-[var(--color-muted)]">Loading…</span>
            ) : null}
          </div>
          <div className="retro-divider my-3" />

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="retro-card-sm p-3">
                <div className="font-bold">No matches</div>
                <div className="text-sm text-[var(--color-muted)]">
                  Try clearing filters or create a new task.
                </div>
              </div>
            ) : (
              tasks.map((t) => {
                const active = t.id === selectedTaskId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={[
                      "w-full text-left retro-card-sm p-3",
                      active
                        ? "bg-[color-mix(in_srgb,var(--color-primary),#fff_88%)]"
                        : "hover:bg-[color-mix(in_srgb,var(--color-primary),#fff_94%)]",
                    ].join(" ")}
                    onClick={() => setSelectedTaskId(t.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-extrabold truncate">{t.title}</div>
                        <div className="text-sm text-[var(--color-muted)] truncate">
                          {t.description || "No description"}
                        </div>
                      </div>
                      <span className={["retro-badge whitespace-nowrap", pillColor(t)].join(" ")}>
                        {t.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="retro-badge">
                        prio: {t.priority}
                      </span>
                      {t.labels.slice(0, 4).map((l) => (
                        <span key={l} className="retro-badge bg-[color-mix(in_srgb,var(--color-accent),#fff_90%)]">
                          {l}
                        </span>
                      ))}
                      {t.labels.length > 4 ? (
                        <span className="retro-badge">+{t.labels.length - 4}</span>
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {selectedIndex >= 0 ? (
            <div className="mt-3 text-sm text-[var(--color-muted)]">
              Selected #{selectedIndex + 1} of {tasks.length}
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div className="retro-card p-3 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="font-extrabold tracking-tight">Details</div>
            {selectedTask ? (
              <button
                type="button"
                className="retro-btn bg-[color-mix(in_srgb,var(--color-danger),#fff_86%)]"
                onClick={() => onDelete(selectedTask.id)}
              >
                Delete
              </button>
            ) : null}
          </div>
          <div className="retro-divider my-3" />

          {!selectedTask ? (
            <div className="retro-card-sm p-3">
              <div className="font-bold">No task selected</div>
              <div className="text-sm text-[var(--color-muted)]">
                Choose a task from the list or create a new one.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="retro-card-sm p-3">
                <div className="text-sm text-[var(--color-muted)]">Title</div>
                <div className="text-xl font-extrabold tracking-tight">
                  {selectedTask.title}
                </div>
              </div>

              <div className="retro-card-sm p-3">
                <div className="text-sm text-[var(--color-muted)]">Description</div>
                <div className="whitespace-pre-wrap">
                  {selectedTask.description || "—"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="retro-card-sm p-3">
                  <div className="text-sm text-[var(--color-muted)]">Status</div>
                  <div className="font-extrabold">
                    {selectedTask.status.replace("_", " ")}
                  </div>
                </div>
                <div className="retro-card-sm p-3">
                  <div className="text-sm text-[var(--color-muted)]">Priority</div>
                  <div className="font-extrabold">{selectedTask.priority}</div>
                </div>
                <div className="retro-card-sm p-3">
                  <div className="text-sm text-[var(--color-muted)]">Due date</div>
                  <div className="font-extrabold">
                    {selectedTask.dueDate || "—"}
                  </div>
                </div>
                <div className="retro-card-sm p-3">
                  <div className="text-sm text-[var(--color-muted)]">Updated</div>
                  <div className="font-extrabold">
                    {new Date(selectedTask.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="retro-card-sm p-3">
                <div className="text-sm text-[var(--color-muted)]">Labels</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTask.labels.length ? (
                    selectedTask.labels.map((l) => (
                      <span
                        key={l}
                        className="retro-badge bg-[color-mix(in_srgb,var(--color-accent),#fff_90%)]"
                      >
                        {l}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[var(--color-muted)]">—</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="retro-btn bg-[color-mix(in_srgb,var(--color-accent),#fff_82%)]"
                  onClick={() => setEditOpen(true)}
                >
                  Edit task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog
        open={createOpen}
        title="Create task"
        onClose={() => setCreateOpen(false)}
      >
        <TaskEditorForm
          availableLabels={labels}
          submitLabel="Create"
          onSubmit={async (payload) => {
            await onCreate(payload);
            setCreateOpen(false);
          }}
        />
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        title="Edit task"
        onClose={() => setEditOpen(false)}
      >
        <TaskEditorForm
          initial={selectedTask}
          availableLabels={labels}
          submitLabel="Save changes"
          onSubmit={async (payload) => {
            if (!selectedTask) return;
            await onUpdate(selectedTask.id, payload);
            setEditOpen(false);
          }}
        />
      </Dialog>
    </section>
  );
}
