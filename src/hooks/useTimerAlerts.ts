"use client";

import { useEffect, useRef } from "react";

/** Play a soft multi-tone completion chime via Web Audio API */
export function useCompletionSound() {
    const acRef = useRef<AudioContext | null>(null);

    const play = () => {
        try {
            if (!acRef.current) {
                acRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ac = acRef.current;
            const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
            notes.forEach((freq, i) => {
                const osc = ac.createOscillator();
                const gain = ac.createGain();
                osc.connect(gain);
                gain.connect(ac.destination);
                osc.type = "sine";
                osc.frequency.value = freq;
                const t = ac.currentTime + i * 0.22;
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.18, t + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
                osc.start(t);
                osc.stop(t + 0.6);
            });
        } catch (e) { /* silently ignore if audio blocked */ }
    };

    return play;
}

/** Request & show a browser notification */
export async function showTimerNotification() {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
        new Notification("⏰ VakitHane — Süren Doldu!", {
            body: "Harika iş! Mola zamanı. 🎉",
            icon: "/favicon.ico",
        });
    }
}

/** Hook: ask for notification permission early */
export function useNotificationPermission() {
    useEffect(() => {
        if (typeof Notification !== "undefined" && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);
}
