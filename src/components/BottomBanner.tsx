"use client";

import React from "react";

export function BottomBanner({ dark = false }: { dark?: boolean }) {
    return (
        <footer className={`w-full py-16 border-t ${dark ? "border-white/5 bg-[#0d0e14]" : "border-foreground/5 bg-background/20"} backdrop-blur-sm flex justify-center items-center relative z-10`}>
            <span className={`text-[11px] ${dark ? "text-white/20" : "text-foreground/20"} font-bold uppercase tracking-[0.4em] select-none text-center px-6`}>
                Designed by <span className={dark ? "text-white/40" : "text-foreground/40"}>Mrk</span>
            </span>
        </footer>
    );
}
