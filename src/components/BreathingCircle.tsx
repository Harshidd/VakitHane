"use client";

import { motion } from "framer-motion";

interface Props {
    running: boolean;
    phaseLabel: string;
    phaseDur: number;
    color: string;
}

export function BreathingCircle({ running, phaseLabel, phaseDur, color }: Props) {
    // If not running, stay small
    const size = running && phaseLabel === "Nefes Al" ? 1.5 :
        running && phaseLabel === "Tut" ? 1.5 :
            running && phaseLabel === "Nefes Ver" ? 1 :
                running && phaseLabel === "Bekle" ? 1 : 1.1; // default rest state

    const opacity = running && phaseLabel === "Nefes Al" ? 0.9 :
        running && phaseLabel === "Tut" ? 1 :
            running && phaseLabel === "Nefes Ver" ? 0.5 :
                running && phaseLabel === "Bekle" ? 0.4 : 0.6; // default

    return (
        <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80">
            {/* Outer animated aura */}
            <motion.div
                animate={{ scale: size, opacity: opacity * 0.5 }}
                transition={{ duration: running ? Math.max(0.5, phaseDur) : 1, ease: "easeInOut" }}
                className="absolute w-40 h-40 rounded-full blur-xl"
                style={{ background: `linear-gradient(to top right, ${color}, transparent)` }}
            />

            {/* Inner glass circle */}
            <motion.div
                animate={{ scale: size, opacity: opacity }}
                transition={{ duration: running ? Math.max(0.5, phaseDur) : 1, ease: "easeInOut" }}
                className="absolute w-40 h-40 rounded-full glass border border-white/20 shadow-2xl flex items-center justify-center"
            >
                <motion.span
                    key={phaseLabel}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg font-bold text-foreground tracking-wide"
                >
                    {running ? phaseLabel : "Başla"}
                </motion.span>
            </motion.div>
        </div>
    );
}
