"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function BreathingCircle() {
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        // Simple 4-7-8 breathing technique logic
        if (phase === "inhale") {
            timeout = setTimeout(() => setPhase("hold"), 4000);
        } else if (phase === "hold") {
            timeout = setTimeout(() => setPhase("exhale"), 7000);
        } else if (phase === "exhale") {
            timeout = setTimeout(() => setPhase("inhale"), 8000);
        }

        return () => clearTimeout(timeout);
    }, [phase]);

    const variants = {
        inhale: { scale: 1.5, opacity: 0.8 },
        hold: { scale: 1.5, opacity: 1 },
        exhale: { scale: 1, opacity: 0.5 },
    };

    const getPhaseText = () => {
        switch (phase) {
            case "inhale": return "Nefes Al";
            case "hold": return "Tut";
            case "exhale": return "Nefes Ver";
        }
    };

    return (
        <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80">
            <motion.div
                animate={phase}
                variants={variants}
                transition={{
                    duration: phase === "inhale" ? 4 : phase === "hold" ? 7 : 8,
                    ease: "easeInOut"
                }}
                className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 blur-xl opacity-50"
            />

            <motion.div
                animate={phase}
                variants={variants}
                transition={{
                    duration: phase === "inhale" ? 4 : phase === "hold" ? 7 : 8,
                    ease: "easeInOut"
                }}
                className="absolute w-40 h-40 rounded-full glass border border-white/20 shadow-2xl flex items-center justify-center"
            >
                <motion.span
                    key={phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg font-medium text-foreground tracking-wide"
                >
                    {getPhaseText()}
                </motion.span>
            </motion.div>
        </div>
    );
}
