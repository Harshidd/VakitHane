"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
    running: boolean;
    phaseLabel: string;
    phaseDur: number;
    color: string;
    timeRemain: number;
    onClick?: () => void;
}

export function BreathingCircle({ running, phaseLabel, phaseDur, color, timeRemain, onClick }: Props) {
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
                            {running ? phaseLabel : "Başla"}
                        </span>
                        {running && timeRemain > 0 && (
                            <span className="text-sm font-bold text-foreground/70 mt-1 tabular-nums">
                                {timeRemain}s
                            </span>
                        )}
                        {!running && (
                            <span className="text-[10px] text-foreground/40 mt-1 uppercase tracking-widest font-bold">
                                Tıkla
                            </span>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
