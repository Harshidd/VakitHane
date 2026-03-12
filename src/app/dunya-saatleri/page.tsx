"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer, ArrowLeft } from "lucide-react";
import { TabBar } from "@/components/TabBar";

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
        <div className="min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col dark" style={{ background: "#0d0e14", color: "#eeedf5" }}>
            <div className="flex flex-col min-h-screen shrink-0 relative z-10 w-full">

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

                {/* ── SEO SECTION ── */}
                <section className="w-full shrink-0 border-t border-white/5 bg-[#0d0e14] py-20 pb-32 relative z-10">
                    <article className="max-w-3xl mx-auto px-6 text-white/60 flex flex-col gap-8">
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold tracking-tight text-white/90">Dünya Saatleri ve Küresel Zaman Dilimleri</h2>
                            <p className="text-[15px] leading-relaxed opacity-90">
                                Küreselleşen dünyada zamanı takip etmek hiç bu kadar önemli olmamıştı. <strong>VakitHane Dünya Saatleri</strong> sayfası, Londra'dan Tokyo'ya, New York'tan Dubai'ye kadar dünyanın dört bir yanındaki önemli şehirlerin güncel saatlerini 3D dünya modeli eşliğinde sunar.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold tracking-tight text-white/90">Anlık Saat Farkı ve Gece/Gündüz Takibi</h3>
                            <p className="text-[15px] leading-relaxed opacity-90">
                                İnteraktif 3D küremiz ve şehir listemiz sayesinde hangi şehrin şu an geceyi yaşadığını, hangisinin güne yeni başladığını emoji göstergeleriyle kolayca anlayabilirsiniz. İş toplantılarınızı planlarken veya yurt dışındaki sevdiklerinizle iletişime geçerken vakit kaybı yaşamadan en doğru zaman bilgisine ulaşın.
                            </p>
                        </div>
                    </article>
                </section>
            </div>

            <div className="fixed bottom-0 inset-x-0 flex justify-center pb-3 pt-4 bg-gradient-to-t from-background/95 to-transparent z-40 pointer-events-none w-full">
                <div className="pointer-events-auto"><TabBar /></div>
            </div>
        </div>
    );
}
