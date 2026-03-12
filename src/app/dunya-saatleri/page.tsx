"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer, ArrowLeft } from "lucide-react";

const Globe3D = dynamic(() => import("@/components/Globe3D").then(m => m.Globe3D), { ssr: false });

const CITIES = [
    { name: "İstanbul", tz: "Europe/Istanbul", flag: "🇹🇷" },
    { name: "Ankara", tz: "Europe/Istanbul", flag: "🇹🇷" },
    { name: "Londra", tz: "Europe/London", flag: "🇬🇧" },
    { name: "Paris", tz: "Europe/Paris", flag: "🇫🇷" },
    { name: "Berlin", tz: "Europe/Berlin", flag: "🇩🇪" },
    { name: "Moskova", tz: "Europe/Moscow", flag: "🇷🇺" },
    { name: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
    { name: "Mumbai", tz: "Asia/Kolkata", flag: "🇮🇳" },
    { name: "Singapur", tz: "Asia/Singapore", flag: "🇸🇬" },
    { name: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
    { name: "Şangay", tz: "Asia/Shanghai", flag: "🇨🇳" },
    { name: "Sidney", tz: "Australia/Sydney", flag: "🇦🇺" },
    { name: "New York", tz: "America/New_York", flag: "🇺🇸" },
    { name: "Los Angeles", tz: "America/Los_Angeles", flag: "🇺🇸" },
    { name: "São Paulo", tz: "America/Sao_Paulo", flag: "🇧🇷" },
];

function CityRow({ city }: { city: typeof CITIES[0] }) {
    const [time, setTime] = useState("--:--");
    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("tr-TR", { timeZone: city.tz, hour: "2-digit", minute: "2-digit" }));
            const h = parseInt(now.toLocaleTimeString("en-US", { timeZone: city.tz, hour: "2-digit", hour12: false }));
            setIsNight(h < 7 || h >= 22);
        };
        update();
        const id = setInterval(update, 15000);
        return () => clearInterval(id);
    }, [city.tz]);

    return (
        <div className="group flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/4 transition-colors cursor-default">
            <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">{city.flag}</span>
                <span className="text-xs font-semibold text-foreground/55 group-hover:text-foreground/80 transition-colors truncate">{city.name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] opacity-20">{isNight ? "🌙" : "☀️"}</span>
                <span className="text-sm font-bold tabular-nums tracking-tight text-foreground/90">{time}</span>
            </div>
        </div>
    );
}

export default function DunyaSaatleriPage() {
    return (
        <div className="h-screen overflow-hidden flex flex-col dark" style={{ background: "#0d0e14", color: "#eeedf5" }}>

            {/* Header */}
            <header className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
                <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-xs font-semibold">
                    <ArrowLeft size={14} />
                    VakitHane
                </Link>
                <span className="text-[13px] text-white/40 tracking-wide font-semibold">Dünya Saatleri</span>
                <div className="w-20" /> {/* spacer */}
            </header>

            {/* Content */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

                {/* Globe */}
                <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                    <Globe3D />
                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white/15 tracking-widest select-none pointer-events-none">
                        sürükle · döndür
                    </p>
                </div>

                {/* City panel */}
                <div className="lg:w-64 xl:w-72 flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 min-h-0 overflow-hidden">

                    {/* Panel header */}
                    <div className="px-4 py-3 border-b border-white/5 shrink-0">
                        <span className="text-[12px] font-semibold text-white/40 tracking-wide">Şehir Saatleri</span>
                    </div>

                    {/* Scrollable city list */}
                    <div className="flex-1 overflow-y-auto py-2 px-1 scrollbar-hide">
                        {CITIES.map(city => (
                            <CityRow key={city.name} city={city} />
                        ))}
                    </div>

                    {/* Footer branding */}
                    <div className="px-4 py-3 border-t border-white/5 shrink-0">
                        <span className="text-[11px] text-white/30 font-medium tracking-wide">
                            design by <strong className="text-white/40">MRK</strong>
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
