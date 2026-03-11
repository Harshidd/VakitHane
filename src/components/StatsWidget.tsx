"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, TrendingUp } from "lucide-react";

export function StatsWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [streak, setStreak] = useState(0);
    const [totalSessions, setTotalSessions] = useState(0);

    // Load stats from localStorage
    useEffect(() => {
        setTimeout(() => {
            const savedStreak = localStorage.getItem("focustime_streak");
            const savedSessions = localStorage.getItem("focustime_sessions");
            if (savedStreak) setStreak(parseInt(savedStreak));
            else setStreak(1); // Demo value

            if (savedSessions) setTotalSessions(parseInt(savedSessions));
            else setTotalSessions(12); // Demo value
        }, 0);
    }, []);

    return (
        <div className="fixed top-24 left-8 z-40">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${isOpen
                        ? "bg-foreground text-background shadow-lg"
                        : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                        }`}
                >
                    <Flame size={18} className={streak > 0 ? "text-orange-500" : ""} />
                    <span className="font-bold tabular-nums">{streak} Gün</span>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10, x: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10, x: 0 }}
                            className="absolute left-0 top-14 w-64 glass p-5 rounded-3xl flex flex-col gap-4 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 border-b border-foreground/10 pb-4">
                                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                                    <Flame size={24} />
                                </div>
                                <div>
                                    <div className="text-xl font-bold">{streak} Günlük</div>
                                    <div className="text-xs text-foreground/50 font-medium uppercase tracking-widest">Seri</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                                    <Trophy size={24} />
                                </div>
                                <div>
                                    <div className="text-xl font-bold">{totalSessions}</div>
                                    <div className="text-xs text-foreground/50 font-medium uppercase tracking-widest">Seans Tamamlandı</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-foreground/80">Harika gidiyorsun!</div>
                                    <div className="text-xs text-foreground/50">Düne göre %15 daha odaklısın.</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
