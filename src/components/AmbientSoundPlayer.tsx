"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, CloudRain, Flame, Wind } from "lucide-react";

export function AmbientSoundPlayer() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const [volume, setVolume] = useState(50);

    const sounds = [
        { id: "rain", name: "Yağmur", icon: CloudRain },
        { id: "fire", name: "Şömine", icon: Flame },
        { id: "wind", name: "Rüzgar", icon: Wind },
    ];

    const handleSoundSelect = (id: string) => {
        if (activeSound === id) {
            setActiveSound(null);
        } else {
            setActiveSound(id);
        }
    };

    useEffect(() => {
        if (activeSound) {
            document.body.setAttribute("data-theme", activeSound);
        } else {
            document.body.removeAttribute("data-theme");
        }
    }, [activeSound]);

    return (
        <div className="fixed top-24 right-8 z-40">
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-3 rounded-full transition-all ${activeSound
                        ? "bg-foreground text-background shadow-lg"
                        : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                        }`}
                >
                    {activeSound ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute right-0 top-14 w-64 glass p-4 rounded-2xl flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-sm text-foreground/70">Ortam Sesleri</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {sounds.map((sound) => {
                                    const Icon = sound.icon;
                                    const isActive = activeSound === sound.id;

                                    return (
                                        <button
                                            key={sound.id}
                                            onClick={() => handleSoundSelect(sound.id)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl gap-2 transition-all ${isActive
                                                ? "bg-foreground text-background"
                                                : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span className="text-xs font-medium">{sound.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {activeSound && (
                                <div className="mt-2 pt-4 border-t border-foreground/10">
                                    <div className="flex items-center gap-3">
                                        <VolumeX size={16} className="text-foreground/40" />
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={volume}
                                            onChange={(e) => setVolume(Number(e.target.value))}
                                            className="w-full accent-foreground"
                                        />
                                        <Volume2 size={16} className="text-foreground/60" />
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
