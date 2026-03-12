"use client";

import { useState, useEffect, useCallback } from "react";
import { TabBar } from "@/components/TabBar";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Moon, RefreshCw, MapPin } from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
interface PrayerTimings {
    Imsak: string; Fajr: string; Sunrise: string;
    Dhuhr: string; Asr: string; Maghrib: string; Isha: string;
}
interface DayData { timings: PrayerTimings; hijri: string; gregorian: string; ramadan: boolean; }

/* ─── Hicri ay Türkçe isimleri ─────────────────────── */
const HIJRI_TR: Record<string, string> = {
    "Muharram": "Muharrem", "Safar": "Safer",
    "Rabi al-awwal": "Rebiülevvel", "Rabi al-thani": "Rebiülahir",
    "Jumada al-ula": "Cemaziyelevvel", "Jumada al-akhirah": "Cemaziyelahir",
    "Rajab": "Recep", "Sha'ban": "Şaban", "Ramadan": "Ramazan",
    "Shawwal": "Şevval", "Dhu al-qi'dah": "Zilkade", "Dhu al-hijjah": "Zilhicce",
};
function toTrHijri(day: string, monthEn: string, year: string) {
    // API returns Arabic month names in various formats — normalize lowercase then map
    const normalized = monthEn.toLowerCase().replace(/ḥ/g, "h").replace(/ā/g, "a").replace(/ī/g, "i")
        .replace(/ū/g, "u").replace(/ṭ/g, "t").replace(/ẓ/g, "z").replace(/ʿ/g, "'");
    const trMonth = Object.entries(HIJRI_TR).find(([k]) => normalized.includes(k.toLowerCase()))?.[1] ?? monthEn;
    return `${day} ${trMonth} ${year}`;
}

/* ─── Prayer display order (Diyanet sırası) ─────────── */
const PRAYER_KEYS: { key: keyof PrayerTimings; label: string }[] = [
    { key: "Imsak", label: "İmsak" },
    { key: "Fajr", label: "Sabah" },
    { key: "Sunrise", label: "Güneş" },
    { key: "Dhuhr", label: "Öğle" },
    { key: "Asr", label: "İkindi" },
    { key: "Maghrib", label: "Akşam" },
    { key: "Isha", label: "Yatsı" },
];

/* ─── Cities ────────────────────────────────────────── */
const CITIES = [
    { id: "Ankara", label: "Ankara" },
    { id: "Istanbul", label: "İstanbul" },
    { id: "Izmir", label: "İzmir" },
    { id: "Bursa", label: "Bursa" },
    { id: "Konya", label: "Konya" },
    { id: "Adana", label: "Adana" },
    { id: "Antalya", label: "Antalya" },
    { id: "Gaziantep", label: "Gaziantep" },
];

/* ─── Aladhan API (Diyanet method=13) ───────────────── */
async function fetchPrayerTimes(city: string, offsetDays = 0): Promise<DayData | null> {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    try {
        const res = await fetch(
            `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=${encodeURIComponent(city)}&country=Turkey&method=13`
        );
        if (!res.ok) return null;
        const j = await res.json();
        const { timings, date: dt } = j.data;
        const { day, month, year } = dt.hijri;
        return {
            timings: timings as PrayerTimings,
            hijri: toTrHijri(day, month.en, year),
            gregorian: dt.gregorian.date,
            ramadan: month.number === 9,
        };
    } catch { return null; }
}

/* ─── Dini Günler ────────────────────────────────────── */
const RELIGIOUS_DAYS = [
    { name: "Miraç Kandili", date: "2026-02-08", emoji: "✨", cat: "kandil" },
    { name: "Berat Kandili", date: "2026-02-25", emoji: "💫", cat: "kandil" },
    { name: "Ramazan Başlangıcı", date: "2026-02-19", emoji: "🌙", cat: "ramazan" },
    { name: "Kadir Gecesi", date: "2026-03-15", emoji: "⭐", cat: "kandil" },
    { name: "Ramazan Bayramı Arefe", date: "2026-03-19", emoji: "🎊", cat: "bayram" },
    { name: "Ramazan Bayramı 1. Gün", date: "2026-03-20", emoji: "🎉", cat: "bayram" },
    { name: "Ramazan Bayramı 2. Gün", date: "2026-03-21", emoji: "🎉", cat: "bayram" },
    { name: "Ramazan Bayramı 3. Gün", date: "2026-03-22", emoji: "🎉", cat: "bayram" },
    { name: "Kurban Bayramı Arefe", date: "2026-05-26", emoji: "🐑", cat: "bayram" },
    { name: "Kurban Bayramı 1. Gün", date: "2026-05-27", emoji: "🐑", cat: "bayram" },
    { name: "Kurban Bayramı 2. Gün", date: "2026-05-28", emoji: "🐑", cat: "bayram" },
    { name: "Kurban Bayramı 3. Gün", date: "2026-05-29", emoji: "🐑", cat: "bayram" },
    { name: "Kurban Bayramı 4. Gün", date: "2026-05-30", emoji: "🐑", cat: "bayram" },
    { name: "Aşure Günü", date: "2026-07-17", emoji: "🕊️", cat: "dini" },
    { name: "Mevlid Kandili", date: "2026-09-15", emoji: "🕌", cat: "kandil" },
];
const CAT_COLOR: Record<string, string> = {
    ramazan: "border-l-emerald-400", bayram: "border-l-amber-400",
    kandil: "border-l-purple-400", dini: "border-l-sky-400",
};
const CAT_LABEL: Record<string, string> = {
    ramazan: "Ramazan", bayram: "Bayram", kandil: "Kandil", dini: "Dini Gün",
};

/* ══════════════════════════════════════════════════════ */
/* Namaz Vakitleri Tab                                    */
/* ══════════════════════════════════════════════════════ */
function PrayerTab() {
    const [dayOffset, setDayOffset] = useState(0);
    const [city, setCity] = useState("Ankara");
    const [data, setData] = useState<DayData | null>(null);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(id);
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        setData(await fetchPrayerTimes(city, dayOffset));
        setLoading(false);
    }, [city, dayOffset]);

    useEffect(() => { load(); }, [load]);

    const displayDate = new Date();
    displayDate.setDate(displayDate.getDate() + dayOffset);
    const dayLabel = dayOffset === 0 ? "Bugün" : dayOffset === 1 ? "Yarın" :
        dayOffset === -1 ? "Dün" :
            displayDate.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });

    let nextKey: keyof PrayerTimings | null = null;
    if (data && dayOffset === 0) {
        const nowMin = now.getHours() * 60 + now.getMinutes();
        for (const { key } of PRAYER_KEYS) {
            if (key === "Sunrise") continue;
            const [h, m] = data.timings[key].split(":").map(Number);
            if (h * 60 + m > nowMin) { nextKey = key; break; }
        }
    }

    return (
        <div className="flex flex-col gap-4">

            {/* Controls */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 glass border border-foreground/12 rounded-xl px-3 py-2.5 shrink-0">
                    <MapPin size={12} className="text-foreground/40" />
                    <select value={city} onChange={e => setCity(e.target.value)}
                        className="bg-transparent text-sm font-bold outline-none cursor-pointer text-foreground/80 appearance-none pr-1">
                        {CITIES.map(c => <option key={c.id} value={c.id} className="bg-background text-foreground">{c.label}</option>)}
                    </select>
                </div>

                <div className="flex-1 flex items-center justify-between glass border border-foreground/12 rounded-xl px-3 py-2">
                    <button onClick={() => setDayOffset(d => d - 1)}
                        className="p-1 rounded-lg hover:bg-foreground/10 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <div className="text-center leading-snug">
                        <div className="text-sm font-bold mb-0.5">{dayLabel}</div>
                        {data && <div className="text-[10px] text-foreground/50 font-medium whitespace-nowrap">
                            {displayDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} <span className="opacity-40 px-0.5">·</span> {data.hijri}
                        </div>}
                    </div>
                    <button onClick={() => setDayOffset(d => d + 1)}
                        className="p-1 rounded-lg hover:bg-foreground/10 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>

                <button onClick={load} disabled={loading}
                    className="p-2.5 rounded-xl glass border border-foreground/12 hover:bg-foreground/10 transition-colors">
                    <RefreshCw size={14} className={loading ? "animate-spin opacity-40" : "opacity-50"} />
                </button>
            </div>

            {/* States */}
            {loading ? (
                <div className="glass-panel h-52 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-foreground/15 border-t-foreground/60 rounded-full animate-spin" />
                </div>
            ) : !data ? (
                <div className="glass-panel p-10 text-center text-sm text-foreground/40">
                    ⚠️ Vakitler yüklenemedi. İnternet bağlantınızı kontrol edin.
                </div>
            ) : (
                <>
                    {/* Next prayer banner */}
                    {nextKey && dayOffset === 0 && (() => {
                        const entry = PRAYER_KEYS.find(p => p.key === nextKey)!;
                        const t = data!.timings[nextKey];
                        const [h, m] = t.split(":").map(Number);
                        const diff = h * 60 + m - (now.getHours() * 60 + now.getMinutes());
                        return (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                className="glass-panel px-6 py-5 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/35 mb-2">
                                        Bir Sonraki Vakit
                                    </div>
                                    <div className="text-4xl font-bold tracking-tight mb-1">{entry.label}</div>
                                    <div className="text-sm text-foreground/45 font-medium">
                                        {t} &nbsp;·&nbsp;
                                        {diff >= 60 ? `${Math.floor(diff / 60)} sa ${diff % 60} dk` : `${diff} dakika`} kaldı
                                    </div>
                                </div>
                                <Moon size={48} className="opacity-8" />
                            </motion.div>
                        );
                    })()}

                    {/* Ramazan — only when hijri month = 9 */}
                    {data.ramadan && dayOffset === 0 && (
                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-400/25 rounded-2xl px-5 py-3">
                            <span className="text-sm font-bold text-emerald-400">🌙 Ramazan · {data.hijri}</span>
                            <div className="text-right text-xs text-emerald-400/80 space-y-0.5">
                                <div>İftar <span className="font-bold text-emerald-300">{data.timings.Maghrib}</span></div>
                                <div>Sahur <span className="font-bold text-emerald-300">{data.timings.Imsak}</span></div>
                            </div>
                        </div>
                    )}

                    {/* Prayer grid — 4 columns, 2 rows (4+3) */}
                    <div className="grid grid-cols-4 gap-2">
                        {PRAYER_KEYS.map(({ key, label }) => {
                            const t = data!.timings[key];
                            const [h, mm2] = t.split(":").map(Number);
                            const nowMin = now.getHours() * 60 + now.getMinutes();
                            const isPast = dayOffset === 0 && h * 60 + mm2 < nowMin && key !== "Imsak";
                            const isNext = key === nextKey && dayOffset === 0;
                            return (
                                <div key={key}
                                    className={`relative py-4 px-3 rounded-2xl border transition-all ${isNext ? "glass-panel border-foreground/20 ring-2 ring-foreground/20" :
                                        isPast ? "border-foreground/5 bg-foreground/3 opacity-35" :
                                            "glass border-foreground/10 hover:border-foreground/20"
                                        }`}
                                >
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-foreground/45 mb-1">{label}</div>
                                    <div className="text-[26px] sm:text-3xl font-bold tabular-nums tracking-tighter leading-none">{t}</div>
                                    {isNext && (
                                        <span className="absolute top-2 right-2 text-[7px] bg-foreground/15 px-1.5 py-0.5 rounded-full font-bold text-foreground/55">
                                            ▶
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-center text-[9px] text-foreground/20 font-medium">
                        Kaynak: Diyanet yöntemi · api.aladhan.com
                    </p>
                </>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════ */
/* Dini Günler Tab                                        */
/* ══════════════════════════════════════════════════════ */
function ReligiousDaysTab() {
    const [filter, setFilter] = useState("hepsi");
    const now = new Date();

    const enriched = RELIGIOUS_DAYS.map(d => {
        const target = new Date(d.date);
        const days = Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
        return { ...d, target, days };
    }).sort((a, b) => a.days - b.days);

    const filtered = filter === "hepsi" ? enriched : enriched.filter(d => d.cat === filter);

    const FILTERS = [
        { key: "hepsi", label: "Tümü" }, { key: "bayram", label: "Bayramlar" },
        { key: "kandil", label: "Kandiller" }, { key: "ramazan", label: "Ramazan" },
        { key: "dini", label: "Diğer" },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-1.5 flex-wrap">
                {FILTERS.map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === f.key
                            ? "bg-foreground text-background border-foreground"
                            : "glass border-foreground/15 text-foreground/50 hover:text-foreground"
                            }`}>{f.label}</button>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                {filtered.map((d, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`glass border border-foreground/8 border-l-4 ${CAT_COLOR[d.cat]} rounded-2xl px-4 py-3.5 flex items-center justify-between ${d.days < -1 ? "opacity-30" : ""}`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xl shrink-0">{d.emoji}</span>
                            <div className="min-w-0">
                                <div className="font-bold text-sm">{d.name}</div>
                                <div className="text-[10px] text-foreground/35 font-medium mt-0.5">
                                    {d.target.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                                    <span className="mx-1.5 opacity-40">·</span>
                                    <span className="uppercase tracking-wide">{CAT_LABEL[d.cat]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 ml-3 text-right">
                            {d.days < -1 ? <span className="text-[10px] text-foreground/25 font-bold">Geçti</span> :
                                d.days <= 0 ? <span className="text-xs font-bold text-amber-400">Bugün 🎊</span> :
                                    d.days === 1 ? <span className="text-xs font-bold text-amber-300">Yarın</span> :
                                        d.days <= 7 ? <span className="text-sm font-bold text-amber-200">{d.days} gün</span> :
                                            <span className="text-sm font-bold">{d.days}<span className="text-[9px] text-foreground/35 ml-0.5">gün</span></span>
                            }
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="text-center text-[9px] text-foreground/20 font-medium">
                Diyanet İşleri Başkanlığı resmi açıklamalarına dayanmaktadır.
            </p>
        </div>
    );
}

/* ══════════════════════════════════════════════════════ */
/* Page                                                   */
/* ══════════════════════════════════════════════════════ */
export default function PrayerTimesPage() {
    const [tab, setTab] = useState<"namaz" | "dinigunler">("namaz");
    return (
        <div className="bg-mesh-default min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="flex flex-col min-h-screen shrink-0 relative z-10 w-full">

                <header className="sticky top-0 z-30 flex justify-center pt-4 pb-3 backdrop-blur-md bg-background/70 border-b border-foreground/5">
                    <div className="flex gap-1 p-1 glass rounded-2xl border border-foreground/10 shadow-md">
                        <button onClick={() => setTab("namaz")}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === "namaz" ? "bg-foreground text-background" : "text-foreground/45 hover:text-foreground"}`}>
                            Namaz Vakitleri
                        </button>
                        <button onClick={() => setTab("dinigunler")}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === "dinigunler" ? "bg-foreground text-background" : "text-foreground/45 hover:text-foreground"}`}>
                            Dini Günler
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-4 py-5 pb-24 max-w-xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        {tab === "namaz" ? (
                            <motion.div key="namaz"
                                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                                transition={{ duration: 0.22 }}>
                                <PrayerTab />
                            </motion.div>
                        ) : (
                            <motion.div key="dinigunler"
                                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.22 }}>
                                <ReligiousDaysTab />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* ── SEO SECTION ── */}
            <section className="w-full shrink-0 border-t border-foreground/5 bg-background/40 backdrop-blur-3xl py-20 pb-32 relative z-10">
                <article className="max-w-3xl mx-auto px-6 text-foreground/80 flex flex-col gap-8">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">İl İl Ezan Vakitleri ve Dini Günler Takvimi</h2>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            İbadetlerinizi vaktinde yerine getirmek için ihtiyacınız olan tüm bilgilere <strong>VakitHane Namaz Vakitleri</strong> sayfasından ulaşabilirsiniz. İstanbul, Ankara, İzmir ve tüm Türkiye illeri için Diyanet İşleri Başkanlığı verileriyle uyumlu <strong>imsak, güneş, öğle, ikindi, akşam ve yatsı</strong> vakitlerini anlık olarak takip edin.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">İftar Sayacı ve Hicri Tarih Bilgisi</h3>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            Modern ve sade arayüzümüz üzerinden sadece bugünkü vakitleri değil, yaklaşan <strong>Kadir Gecesi, Ramazan Bayramı, Kurban Bayramı</strong> gibi dini gün ve gecelere ne kadar süre kaldığını da görebilirsiniz. Miladi tarihin yanı sıra Hicri takvim desteğiyle manevi takviminizi her an yanınızda taşıyın.
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
