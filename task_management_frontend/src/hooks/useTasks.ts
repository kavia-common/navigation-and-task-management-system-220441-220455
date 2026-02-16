"use client";

import type { RealtimeEvent, Task, TaskStatus } from "@/lib/types";
import { createTask, deleteTask, listTasks, updateTask } from "@/lib/taskApi";
import { useEffect, useMemo, useState } from "react";

export type TaskFilters = {
  query: string;
  status: "all" | TaskStatus;
  label: string; // "" means all
  priority: "all" | "low" | "medium" | "high";
};

/**
 * PUBLIC_INTERFACE
 * Task state management hook (local state + backend wiring points).
 */
export function useTasks(realtimeEvent: RealtimeEvent | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const [filters, setFilters] = useState<TaskFilters>({
    query: "",
    status: "all",
    label: "",
    priority: "all",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await listTasks();
        if (!mounted) return;
        setTasks(data);
        setSelectedTaskId((prev) => prev || (data[0]?.id ?? ""));
        setError("");
      } catch (e) {
        if (!mounted) return;
        setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!realtimeEvent) return;

    // Apply common realtime patterns to local state.
    if (realtimeEvent.type === "task.created") {
      setTasks((prev) => [realtimeEvent.task, ...prev]);
      return;
    }
    if (realtimeEvent.type === "task.updated") {
      setTasks((prev) =>
        prev.map((t) => (t.id === realtimeEvent.task.id ? realtimeEvent.task : t))
      );
      return;
    }
    if (realtimeEvent.type === "task.deleted") {
      setTasks((prev) => prev.filter((t) => t.id !== realtimeEvent.taskId));
      setSelectedTaskId((prev) =>
        prev === realtimeEvent.taskId ? "" : prev
      );
    }
  }, [realtimeEvent]);

  const labels = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => t.labels.forEach((l) => set.add(l)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.priority !== "all" && t.priority !== filters.priority)
        return false;
      if (filters.label && !t.labels.includes(filters.label)) return false;
      if (!q) return true;

      const hay = `${t.title} ${t.description ?? ""} ${t.labels.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [tasks, filters]);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  async function onCreate(payload: Parameters<typeof createTask>[0]) {
    const created = await createTask(payload);
    setTasks((prev) => [created, ...prev]);
    setSelectedTaskId(created.id);
  }

  async function onUpdate(id: string, payload: Parameters<typeof updateTask>[1]) {
    const updated = await updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function onDelete(id: string) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSelectedTaskId((prev) => (prev === id ? "" : prev));
  }

  return {
    loading,
    error,
    tasks: filteredTasks,
    allTasks: tasks,
    selectedTask,
    selectedTaskId,
    setSelectedTaskId,
    filters,
    setFilters,
    labels,
    onCreate,
    onUpdate,
    onDelete,
  };
}
