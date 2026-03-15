"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
    running: boolean;
    phaseLabel: string;
    phaseDur: number;
    color: string;
    timeRemain: number;
    phase?: number;
    onClick?: () => void;
}

import { useLanguage } from "@/context/LanguageContext";

export function BreathingCircle({ running, phaseLabel, phaseDur, color, timeRemain, phase = 0, onClick }: Props) {
    const { t } = useLanguage();
    // If not running, stay small
    // Use phase index for size and opacity to be independent of translated label
    const size = running && phase === 0 ? 1.5 : // Inhale
        running && phase === 1 ? 1.5 : // Hold
            running && phase === 2 ? 1 : // Exhale
                running && phase === 3 ? 1 : 1.1; // Wait/Rest

    const opacity = running && phase === 0 ? 0.9 :
        running && phase === 1 ? 1 :
            running && phase === 2 ? 0.5 :
                running && phase === 3 ? 0.4 : 0.6;

    return (
        <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80">
            {/* Outer animated aura */}
            <motion.div
                animate={{ scale: size, opacity: opacity * 0.4 }}
                transition={{ duration: running ? Math.max(0.5, phaseDur) : 1, ease: "easeInOut" }}
                className="absolute w-52 h-52 rounded-full blur-2xl pointer-events-none"
                style={{ background: `linear-gradient(to top right, ${color}, transparent)` }}
            />

            {/* Inner glass circle (Interactive) */}
            <motion.button
                onClick={onClick}
                whileHover={{ scale: size * 1.05 }}
                whileTap={{ scale: size * 0.95 }}
                animate={{ scale: size, opacity: opacity }}
                transition={{ duration: running ? Math.max(0.5, phaseDur) : 1, ease: "easeInOut" }}
                className="absolute w-52 h-52 rounded-full glass border border-white/20 shadow-2xl flex flex-col items-center justify-center cursor-pointer select-none"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={running ? phaseLabel : "idle"}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-center"
                    >
                        <span className="text-2xl font-black text-foreground tracking-wide text-center leading-tight">
                            {running ? phaseLabel : t("start")}
                        </span>
                        {running && timeRemain > 0 && (
                            <span className="text-sm font-bold text-foreground/70 mt-1 tabular-nums">
                                {timeRemain}s
                            </span>
                        )}
                        {!running && (
                            <span className="text-[12px] text-foreground/45 mt-1 tracking-wide font-medium">
                                {t("click")}
                            </span>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
