"use client";

import { useState, useEffect } from "react";
import { TabBar } from "@/components/TabBar";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Target, Sparkles, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { HomeButton } from "@/components/HomeButton";
import { BottomBanner } from "@/components/BottomBanner";

const EXAMS = [
    { id: "yks", name: "YKS 2026", date: new Date("2026-06-20T10:15:00"), color: "#6366f1", emoji: "🎓" },
    { id: "lgs", name: "LGS 2026", date: new Date("2026-06-06T09:30:00"), color: "#10b981", emoji: "📚" },
    { id: "kpss", name: "KPSS Lisans", date: new Date("2026-07-12T10:15:00"), color: "#f59e0b", emoji: "⚖️" },
    { id: "ales", name: "ALES", date: new Date("2026-09-06T09:30:00"), color: "#ec4899", emoji: "📝" },
];

const MOTIVATIONS: Record<string, string[]> = {
    tr: [
        "Bugün döktüğün ter, yarınki başarına dönüşecek.",
        "Ertelediğin her gün, hayallerinden bir gün çalar. Şimdi başla.",
        "Büyük başarılar, küçük ama sürekli adımlarla gelir.",
        "Zorluklar, yeteneklerini uyandıran kıvılcımlardır.",
        "Vazgeçmeyi düşündüğünde, neden başladığını hatırla.",
        "Yorgunluk geçer, geriye zaferin gururu kalır.",
        "Şansa inanma — disipline ve çok çalışmaya inan.",
        "Masanda geçirdiğin her saat, geleceğine yapılan yatırımdır.",
    ],
    en: [
        "The sweat you shed today will turn into your success tomorrow.",
        "Every day you delay steals a day from your dreams. Start now.",
        "Great achievements come from small but consistent steps.",
        "Difficulties are the sparks that awaken your talents.",
        "When you think of giving up, remember why you started.",
        "Fatigue passes, but the pride of victory remains.",
        "Don't believe in luck — believe in discipline and hard work.",
        "Every hour you spend at your desk is an investment in your future.",
    ],
};

function useCountdown(targetDate: Date) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        const tick = () => {
            const diff = targetDate.getTime() - Date.now();
            if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
            setTimeLeft({
                days: Math.floor(diff / 86_400_000),
                hours: Math.floor((diff / 3_600_000) % 24),
                minutes: Math.floor((diff / 60_000) % 60),
                seconds: Math.floor((diff / 1_000) % 60),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return timeLeft;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

export default function SinavSayaciPage() {
    const { t, language, setLanguage } = useLanguage();
    const [selectedId, setSelectedId] = useState("yks");
    const exam = EXAMS.find(e => e.id === selectedId) ?? EXAMS[0];
    const countdown = useCountdown(exam.date);

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
    const motivations = MOTIVATIONS[language] || MOTIVATIONS["en"];
    const quote = motivations[dayOfYear % motivations.length];

    return (
        <div className="bg-mesh-default min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="flex flex-col min-h-screen shrink-0 w-full relative z-10">
                {/* Tab selector as page header */}
                <header className="sticky top-0 z-30 w-full px-4 py-3 backdrop-blur-md bg-background/70 border-b border-foreground/5 flex items-center justify-center min-h-[60px] md:min-h-[70px]">
                    <div className="absolute left-4">
                        <HomeButton />
                    </div>

                    <div className="flex gap-1 p-1 glass rounded-2xl border border-foreground/10 shadow-md overflow-x-auto scrollbar-hide mx-auto max-w-[75%] sm:max-w-none">
                        {EXAMS.map(ex => (
                            <button key={ex.id} onClick={() => setSelectedId(ex.id)}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 sm:gap-1.5 ${selectedId === ex.id
                                    ? "bg-foreground text-background shadow-sm"
                                    : "text-foreground/45 hover:text-foreground"
                                    }`}>
                                <span>{ex.emoji}</span> {ex.name}
                            </button>
                        ))}
                    </div>

                    <div className="absolute right-4 flex items-center gap-2">
                        <button
                            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
                            className="px-2.5 py-1.5 rounded-full hover:bg-foreground/10 transition-colors opacity-50 hover:opacity-100 flex items-center gap-1.5 glass border border-foreground/10"
                        >
                            <Languages size={13} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{language}</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 pb-24 gap-6 relative z-10">

                    {/* Motivasyon alıntı */}
                    <motion.div
                        key={quote}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 max-w-xl text-center px-4"
                    >
                        <Sparkles size={14} className="text-foreground/25 shrink-0 mt-0.5" />
                        <p className="text-xs font-medium text-foreground/40 italic leading-relaxed">{quote}</p>
                        <Sparkles size={14} className="text-foreground/25 shrink-0 mt-0.5" />
                    </motion.div>

                    {/* Sınav başlık */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-xl flex flex-col items-center gap-5"
                        >
                            {/* Exam info */}
                            <div className="flex flex-col items-center gap-1 text-center">
                                <div className="flex items-center gap-2 text-foreground/50 text-[11px] sm:text-[13px] font-semibold tracking-wide">
                                    <Target size={14} />
                                    {t("target_time_left")}
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{exam.name}</h1>
                                <p className="text-[10px] sm:text-xs text-foreground/35 font-medium">
                                    {exam.date.toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>

                            {/* Countdown blocks */}
                            <div className="grid grid-cols-4 gap-3 w-full">
                                {[
                                    { label: t("day"), value: countdown.days },
                                    { label: t("hour"), value: countdown.hours },
                                    { label: t("minute"), value: countdown.minutes },
                                    { label: t("second"), value: countdown.seconds },
                                ].map(({ label, value }, i) => (
                                    <div key={i}
                                        className="flex flex-col items-center gap-2 glass-panel py-6 px-2 rounded-2xl border border-foreground/10 relative overflow-hidden">
                                        {/* Accent top line */}
                                        <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60 rounded-full"
                                            style={{ background: exam.color }} />
                                        <span className="text-5xl sm:text-6xl font-bold tabular-nums tracking-tighter"
                                            style={{ fontVariantNumeric: "tabular-nums" }}>
                                            {pad(value)}
                                        </span>
                                        <span className="text-[12px] font-medium tracking-wide text-foreground/50">{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Progress bar */}
                            {(() => {
                                const totalDays = Math.max(1, Math.ceil((exam.date.getTime() - new Date("2026-01-01").getTime()) / 86_400_000));
                                const remainDays = countdown.days;
                                const pct = Math.max(0, Math.min(100, 100 - (remainDays / totalDays * 100)));
                                return (
                                    <div className="w-full">
                                        <div className="flex justify-between text-[11px] sm:text-[12px] text-foreground/45 font-medium tracking-wide mb-1.5">
                                            <span className="flex items-center gap-1"><BookOpen size={10} /> {t("elapsed_time")}</span>
                                            <span>{pct.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-foreground/8 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full rounded-full"
                                                style={{ background: exam.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })()}

                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* ── SEO SECTION ── */}
            <section className="w-full shrink-0 border-t border-foreground/5 bg-background/40 backdrop-blur-3xl py-20 pb-32 relative z-10">
                <article className="max-w-3xl mx-auto px-6 text-foreground/80 flex flex-col gap-8">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("seo_exam_t1")}</h2>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            {t("seo_exam_p1")}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">{t("seo_exam_t2")}</h3>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            {t("seo_exam_p2")}
                        </p>
                    </div>
                </article>
            </section>

            <BottomBanner />

            {/* TabBar */}
            <div className="fixed bottom-0 inset-x-0 flex justify-center pb-3 pt-4 bg-gradient-to-t from-background/95 to-transparent z-40 pointer-events-none">
                <div className="pointer-events-auto"><TabBar /></div>
            </div>
        </div>
    );
}
