"use client";

import { getWsUrl } from "@/lib/config";
import type { RealtimeEvent } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

type Status = "disconnected" | "connecting" | "connected" | "error";

/**
 * PUBLIC_INTERFACE
 * Subscribe to task realtime updates.
 *
 * Expected server messages (JSON):
 *  - { "type": "task.created", "task": { ... } }
 *  - { "type": "task.updated", "task": { ... } }
 *  - { "type": "task.deleted", "taskId": "..." }
 *
 * If the backend differs, use Settings to configure WS URL and adjust message shape here.
 */
export function useTaskRealtime() {
  const [status, setStatus] = useState<Status>("disconnected");
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = getWsUrl();
    setStatus("connecting");

    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch (e) {
      setStatus("error");
      setLastEvent({
        type: "error",
        message: `WebSocket init failed: ${String(e)}`,
      });
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      setLastEvent({ type: "info", message: "Realtime connected" });
    };

    ws.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(String(msg.data)) as RealtimeEvent;
        if (!parsed || typeof parsed !== "object" || !("type" in parsed)) return;
        setLastEvent(parsed);
      } catch {
        // ignore non-JSON messages
      }
    };

    ws.onerror = () => {
      setStatus("error");
      setLastEvent({ type: "error", message: "Realtime error" });
    };

    ws.onclose = () => {
      setStatus("disconnected");
      setLastEvent({ type: "info", message: "Realtime disconnected" });
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  return { status, lastEvent };
}
