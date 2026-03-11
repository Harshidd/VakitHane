"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Settings, Timer } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
    const [isDark, setIsDark] = useState(false);

    // Quick initial theme setup
    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.classList.add("dark");
            setTimeout(() => setIsDark(true), 0);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex justify-between items-center py-6 px-8 absolute top-0 z-50"
        >
            <div className="flex items-center gap-2 cursor-pointer group">
                <div className="bg-foreground text-background p-2 rounded-xl group-hover:rotate-12 transition-transform">
                    <Timer size={20} />
                </div>
                <span className="font-semibold text-xl tracking-tight">VakitHane</span>
            </div>

            <div className="flex gap-4">
                <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <Settings size={20} className="opacity-70" />
                </button>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    {isDark ? <Sun size={20} className="opacity-70" /> : <Moon size={20} className="opacity-70" />}
                </button>
            </div>
        </motion.nav>
    );
}
