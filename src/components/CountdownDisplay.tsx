"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CountdownDisplayProps {
    minutes: number;
    seconds: number;
}

export function CountdownDisplay({ minutes, seconds }: CountdownDisplayProps) {
    const pad = (num: number) => num.toString().padStart(2, "0");

    const formattedMins = pad(minutes);
    const formattedSecs = pad(seconds);

    return (
        <div className="flex items-center justify-center text-[7rem] sm:text-[9rem] font-bold tracking-tighter tabular-nums leading-none text-foreground/90 select-none">
            <AnimatedNumber value={formattedMins} />
            <span className="mx-2 -mt-4 text-foreground/50 animate-pulse">:</span>
            <AnimatedNumber value={formattedSecs} />
        </div>
    );
}

function AnimatedNumber({ value }: { value: string }) {
    return (
        <div className="flex overflow-hidden relative" style={{ height: "1em" }}>
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="block absolute"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
            <span className="invisible">{value}</span>
        </div>
    );
}
