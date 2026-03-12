"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, CloudRain, Flame, Wind, Rocket } from "lucide-react";

export function AmbientSoundPlayer() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [volume, setVolume] = useState(50);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const sounds = [
        { id: "rain", name: "Yağmur", icon: CloudRain },
        { id: "fire", name: "Şömine", icon: Flame },
        { id: "wind", name: "Rüzgar", icon: Wind },
        { id: "space", name: "Uzay", icon: Rocket },
    ];

    useEffect(() => {
        // Initialize audio instance
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const handleSoundSelect = (id: string) => {
        if (!audioRef.current) return;

        if (activeSound === id) {
            // Toggle off
            setActiveSound(null);
            audioRef.current.pause();
            document.body.removeAttribute("data-theme");
        } else {
            // Switch to new sound
            setActiveSound(id);
            document.body.setAttribute("data-theme", id);
            audioRef.current.src = `/sounds/${id}.mp3`;
            audioRef.current.volume = volume / 100;
            audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
        }
    };

    return (
        <div className="fixed top-24 right-5 sm:right-8 z-40">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-3 rounded-full transition-all border ${activeSound
                        ? "bg-foreground text-background shadow-lg border-transparent"
                        : "glass text-foreground/70 hover:bg-foreground/10 border-foreground/15"
                        }`}
                >
                    {activeSound ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10, originX: 1, originY: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute right-0 top-14 w-60 sm:w-64 glass p-4 rounded-2xl flex flex-col gap-4 shadow-xl border border-foreground/15"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs uppercase tracking-widest text-foreground/50">Ortam Sesleri</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {sounds.map((sound) => {
                                    const Icon = sound.icon;
                                    const isActive = activeSound === sound.id;

                                    return (
                                        <button
                                            key={sound.id}
                                            onClick={() => handleSoundSelect(sound.id)}
                                            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl gap-2 transition-all border ${isActive
                                                ? "bg-foreground text-background shadow-md border-transparent"
                                                : "glass border-foreground/15 text-foreground/60 hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30"
                                                }`}
                                        >
                                            <Icon size={20} className={isActive ? "opacity-90" : "opacity-60"} />
                                            <span className="text-[10px] sm:text-xs font-bold">{sound.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {activeSound && (
                                <div className="mt-1 pt-4 border-t border-foreground/10">
                                    <div className="flex items-center gap-3">
                                        <VolumeX size={14} className="text-foreground/40 shrink-0" />
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={volume}
                                            onChange={(e) => setVolume(Number(e.target.value))}
                                            className="w-full h-1.5 bg-foreground/10 rounded-full appearance-none outline-none cursor-pointer accent-foreground"
                                        />
                                        <Volume2 size={14} className="text-foreground/60 shrink-0" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
