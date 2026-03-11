"use client";

import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Props {
    isRunning: boolean;
    onToggle: () => void;
    onReset: () => void;
    onSkip?: () => void;
}

export function TimerControls({ isRunning, onToggle, onReset }: Props) {
    return (
        <div className="flex items-center gap-3">
            <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={onReset}
                className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-foreground/5 hover:bg-foreground/12 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Sıfırla"
            >
                <RotateCcw size={20} />
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onToggle}
                className="px-7 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-foreground text-background font-bold text-base sm:text-lg shadow-lg shadow-foreground/20 hover:shadow-xl hover:shadow-foreground/25 flex items-center justify-center gap-2 min-w-[120px] sm:min-w-[160px] transition-shadow"
            >
                {isRunning ? (
                    <><Pause fill="currentColor" size={18} /> Duraklat</>
                ) : (
                    <><Play fill="currentColor" size={18} /> Başlat</>
                )}
            </motion.button>
        </div>
    );
}
