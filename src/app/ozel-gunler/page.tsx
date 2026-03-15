"use client";

import { useState, useEffect } from "react";
import { TabBar } from "@/components/TabBar";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Calendar, Clock, Sparkles, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Event { id: string; name: string; date: string; emoji: string; }

const EMOJIS = ["🎂", "🎉", "💍", "🏖️", "✈️", "🎓", "🏆", "💼", "🌟", "🎁", "❤️", "🎪"];

const DEFAULT_EVENTS: Event[] = [
    { id: "1", name: "Yeni Yıl 2027", date: "2027-01-01T00:00:00", emoji: "🎉" },
    { id: "2", name: "Yaz Tatili", date: "2026-06-15T09:00:00", emoji: "🏖️" },
];

function getTimeLeft(dateStr: string, t: (s: string) => string): { text: string; urgent: boolean } {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return { text: t("expired"), urgent: false };
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff / 3_600_000) % 24);
    const m = Math.floor((diff / 60_000) % 60);
    if (d > 0) return { text: `${d} ${t("day")} ${h} ${t("hour")}`, urgent: d <= 7 };
    if (h > 0) return { text: `${h} ${t("hour")} ${m} ${t("minute")}`, urgent: true };
    return { text: `${m} ${t("minute")}`, urgent: true };
}

const LS_KEY = "vakithane_ozel_gunler";

export default function OzelGunlerPage() {
    const { t, language, setLanguage } = useLanguage();
    const DEFAULT_EVENTS: Event[] = [
        { id: "1", name: language === "tr" ? "Yeni Yıl 2027" : "New Year 2027", date: "2027-01-01T00:00:00", emoji: "🎉" },
        { id: "2", name: language === "tr" ? "Yaz Tatili" : "Summer Break", date: "2026-06-15T09:00:00", emoji: "🏖️" },
    ];
    const [events, setEvents] = useState<Event[]>([]);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [emoji, setEmoji] = useState("🎉");
    const [showForm, setShowForm] = useState(false);
    const [tick, setTick] = useState(0);
    const [ready, setReady] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(LS_KEY);
        setEvents(stored ? JSON.parse(stored) : DEFAULT_EVENTS);
        setReady(true);
    }, []);

    // Tick every minute to refresh countdowns
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 60_000);
        return () => clearInterval(id);
    }, []);

    const save = (updated: Event[]) => {
        setEvents(updated);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
    };

    const add = () => {
        if (!name.trim() || !date) return;
        const updated = [...events, { id: Date.now().toString(), name: name.trim(), date, emoji }]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        save(updated);
        setName(""); setDate(""); setEmoji("🎉"); setShowForm(false);
    };

    const del = (id: string) => save(events.filter(e => e.id !== id));

    return (
        <div className="bg-mesh-default min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="flex flex-col min-h-screen shrink-0 w-full relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-30 flex flex-col md:flex-row items-center justify-between px-5 pt-4 pb-3 backdrop-blur-md bg-background/70 border-b border-foreground/5 gap-3">
                    <div className="flex items-center gap-2 text-foreground/60 text-[14px] font-semibold tracking-tight">
                        <Calendar size={15} /> {t("my_special_days")}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
                            className="p-2 rounded-full hover:bg-foreground/10 transition-colors opacity-50 hover:opacity-100 flex items-center gap-1.5 glass border border-foreground/10"
                        >
                            <Languages size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{language}</span>
                        </button>

                        <button onClick={() => setShowForm(s => !s)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${showForm
                                ? "bg-foreground text-background border-foreground"
                                : "glass border-foreground/20 text-foreground/60 hover:text-foreground"
                                }`}>
                            <Plus size={13} />
                            {t("add")}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 max-w-xl mx-auto w-full">

                    {/* Add form */}
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-4"
                            >
                                <div className="glass-panel p-5 flex flex-col gap-3">
                                    <p className="text-[12px] font-semibold tracking-wide text-foreground/50 flex items-center gap-1.5">
                                        <Sparkles size={12} /> {t("new_event")}
                                    </p>

                                    {/* Emoji picker */}
                                    <div className="flex gap-1.5 flex-wrap">
                                        {EMOJIS.map(em => (
                                            <button key={em} onClick={() => setEmoji(em)}
                                                className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center transition-all ${emoji === em ? "bg-foreground/20 scale-110" : "hover:bg-foreground/10"
                                                    }`}>{em}</button>
                                        ))}
                                    </div>

                                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                                        placeholder={t("event_name_placeholder")}
                                        className="w-full glass border border-foreground/15 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-foreground/25 placeholder:text-foreground/25" />

                                    <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)}
                                        className="w-full glass border border-foreground/15 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-foreground/25 text-foreground" />

                                    <div className="flex gap-2">
                                        <button onClick={() => setShowForm(false)}
                                            className="flex-1 py-2 rounded-xl glass border border-foreground/15 text-xs font-bold text-foreground/50 hover:text-foreground transition-colors">
                                            {t("cancel")}
                                        </button>
                                        <button onClick={add} disabled={!name.trim() || !date}
                                            className="flex-1 py-2 rounded-xl bg-foreground text-background text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-30 transition-all">
                                            <Plus size={13} /> {t("save")}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Event list */}
                    {ready && events.length === 0 && (
                        <div className="glass-panel p-10 text-center text-foreground/30 text-sm border border-dashed border-foreground/15">
                            {t("no_events_yet")} <br />
                            <span className="text-xs">{t("add_from_top")}</span>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <AnimatePresence initial={false}>
                            {ready && events.map((ev) => {
                                const { text, urgent } = getTimeLeft(ev.date, t);
                                const isExpired = new Date(ev.date).getTime() < Date.now();
                                return (
                                    <motion.div key={ev.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.93 }}
                                        className={`glass-panel px-5 py-4 flex items-center gap-4 relative overflow-hidden ${isExpired ? "opacity-40" : ""}`}
                                    >
                                        {/* Emoji */}
                                        <span className="text-3xl shrink-0">{ev.emoji}</span>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm truncate">{ev.name}</div>
                                            <div className="text-[10px] text-foreground/35 font-medium mt-0.5 flex items-center gap-1">
                                                <Clock size={9} />
                                                {new Date(ev.date).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US", {
                                                    day: "numeric", month: "long", year: "numeric",
                                                    hour: "2-digit", minute: "2-digit",
                                                })}
                                            </div>
                                        </div>

                                        {/* Countdown */}
                                        <div className="text-right shrink-0">
                                            <div className={`text-sm font-bold ${urgent ? "text-amber-400" : ""}`}>
                                                {text}
                                            </div>
                                            {urgent && !isExpired && (
                                                <div className="text-[10px] text-amber-500 font-semibold tracking-wide pt-0.5">{t("approaching")}</div>
                                            )}
                                        </div>

                                        {/* Delete */}
                                        <button onClick={() => del(ev.id)}
                                            className="shrink-0 p-1.5 rounded-xl text-foreground/20 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Tick dependency consumer (invisible) */}
                    <span className="hidden">{tick}</span>
                </main>
            </div>

            {/* ── SEO SECTION ── */}
            <section className="w-full shrink-0 border-t border-foreground/5 bg-background/40 backdrop-blur-3xl py-20 pb-32 relative z-10">
                <article className="max-w-3xl mx-auto px-6 text-foreground/80 flex flex-col gap-8">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("seo_special_t1")}</h2>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            {t("seo_special_p1")}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">{t("seo_special_t2")}</h3>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            {t("seo_special_p2")}
                        </p>
                    </div>
                </article>
            </section>

            <div className="fixed bottom-0 inset-x-0 flex justify-center pb-3 pt-4 bg-gradient-to-t from-background/95 to-transparent z-40 pointer-events-none">
                <div className="pointer-events-auto"><TabBar /></div>
            </div>
        </div>
    );
}
