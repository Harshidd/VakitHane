"use client";

import { useEffect, useRef } from "react";

interface SessionData {
    sessions: number;
    totalSeconds: number;
    lastDate: string;
}

const KEY = "focustime_stats";

export function loadStats(): SessionData {
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return { sessions: 0, totalSeconds: 0, lastDate: "" };
}

export function saveSession(seconds: number) {
    const today = new Date().toISOString().slice(0, 10);
    const data = loadStats();
    if (data.lastDate !== today) {
        // Reset daily count on new day
        data.sessions = 1;
        data.totalSeconds = seconds;
        data.lastDate = today;
    } else {
        data.sessions += 1;
        data.totalSeconds += seconds;
    }
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function formatTotal(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}s ${m}dk`;
    return `${m}dk`;
}

/** React hook — returns live stats, call after session completes */
export function useSessionStats() {
    const stateRef = useRef<SessionData>(loadStats());
    const reload = () => { stateRef.current = loadStats(); };
    return { stats: stateRef.current, saveSession, reload };
}
