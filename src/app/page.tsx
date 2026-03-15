"use client";

import { useState, useEffect, useCallback } from "react";
import { TabBar } from "@/components/TabBar";
import { VintageWallClock } from "@/components/VintageWallClock";
import { RippleBackground } from "@/components/RippleBackground";
import { ProgressArc } from "@/components/ProgressArc";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, Moon, Calendar, Wind, LucideIcon,
  Timer, Settings, Sun, Play, Pause, RotateCcw, Target,
  Flame, Clock4, Hourglass, Globe2
} from "lucide-react";
import { useCompletionSound, showTimerNotification, useNotificationPermission } from "@/hooks/useTimerAlerts";
import { loadStats, saveSession, formatTotal } from "@/hooks/useSessionStats";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

interface CatItem { id: string; name: string; icon: LucideIcon; href: string; desc: string; side: string; }

const PRESET_GROUPS = [
  {
    label: "LGS",
    items: [
      { label: "Sözel 75", seconds: 75 * 60 },
      { label: "Sayısal 80", seconds: 80 * 60 },
    ],
  },
  {
    label: "YKS",
    items: [
      { label: "TYT 165", seconds: 165 * 60 },
      { label: "AYT 180", seconds: 180 * 60 },
    ],
  },
];
const PRESETS = PRESET_GROUPS.flatMap(g => g.items);

const getCategories = (t: (s: string) => string): CatItem[] => [
  { id: "school", name: t("school_exams"), icon: BookOpen, href: "/sinav-sayaci", desc: t("exam_countdowns"), side: "left" },
  { id: "religion", name: t("faith_worship"), icon: Moon, href: "/namaz-vakitleri", desc: t("namaz_iftar"), side: "left" },
  { id: "stopwatch", name: t("stopwatch"), icon: Hourglass, href: "/kronometre", desc: t("time_measurement"), side: "left" },
  { id: "space", name: t("relaxation"), icon: Wind, href: "/meditasyon", desc: t("breath_meditation"), side: "right" },
  { id: "events", name: t("special_days"), icon: Calendar, href: "/ozel-gunler", desc: t("event_countdowns"), side: "right" },
  { id: "worldclock", name: t("world_clocks"), icon: Globe2, href: "/dunya-saatleri", desc: t("cities_timezones"), side: "right" },
];

const DEFAULT_CLOCK_SIZE = 340;

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const CATEGORIES = getCategories(t);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [stats, setStats] = useState({ sessions: 0, totalSeconds: 0 });
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [clockSize, setClockSize] = useState(DEFAULT_CLOCK_SIZE);

  const playChime = useCompletionSound();
  useNotificationPermission();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setClockSize(280);
      else if (width < 1024) setClockSize(320);
      else setClockSize(DEFAULT_CLOCK_SIZE);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { setStats(loadStats()); }, []);
  useEffect(() => {
    document.documentElement.classList.add("dark");
    setIsDark(true);
  }, []);

  const toggleTheme = () => {
    isDark
      ? (document.documentElement.classList.remove("dark"), setIsDark(false))
      : (document.documentElement.classList.add("dark"), setIsDark(true));
  };

  const applyTime = (total: number, idx: number | null = null) => {
    setInitialTime(total); setTimeLeft(total); setActivePreset(idx);
  };

  const start = () => { if (timeLeft > 0) setIsRunning(true); };
  const pause = () => setIsRunning(false);
  const stop = useCallback(() => {
    setIsRunning(false); setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 0) {
      setIsRunning(false);
      saveSession(initialTime); setStats(loadStats());
      playChime(); showTimerNotification();
      return;
    }
    const id = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft, initialTime, playChime]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const H = Math.floor(timeLeft / 3600);
  const M = Math.floor((timeLeft % 3600) / 60);
  const S = timeLeft % 60;
  const progress = initialTime > 0 ? timeLeft / initialTime : 1;
  const isPaused = !isRunning && timeLeft > 0 && timeLeft !== initialTime;

  const setHours = (h: number) => applyTime(h * 3600 + Math.floor((initialTime % 3600) / 60) * 60, null);
  const setMins = (m: number) => applyTime(Math.floor(initialTime / 3600) * 3600 + m * 60, null);

  return (
    <div className="bg-mesh-default relative flex flex-col min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
      <div className="flex flex-col min-h-screen shrink-0 relative z-10 w-full">
        <RippleBackground />

        {/* ── HEADER ── */}
        {!isRunning && (
          <header className="w-full flex items-center justify-center px-5 py-3 z-50 relative shrink-0 border-b border-foreground/5 bg-background/20 backdrop-blur-sm min-h-[64px] md:min-h-[74px]">
            <div className="absolute left-5 flex items-center gap-3 shrink-0">
              <div className="group flex items-center gap-2 cursor-pointer">
                <div className="bg-foreground text-background p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-md">
                  <Timer size={14} />
                </div>
                <span className="font-bold text-[15px] tracking-tight hidden sm:block">VakitHane</span>
              </div>
            </div>

            <div className="flex items-center">
              <TabBar inline />
            </div>

            <div className="absolute right-5 flex gap-1 items-center shrink-0">
              <button
                onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
                className="p-2 rounded-full hover:bg-foreground/10 transition-colors opacity-50 hover:opacity-100 flex items-center gap-1.5"
              >
                <Languages size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{language}</span>
              </button>
              <div className="hidden xs:flex gap-1 items-center">
                <button className="p-2 rounded-full hover:bg-foreground/10 transition-colors opacity-50 hover:opacity-100">
                  <Settings size={14} />
                </button>
              </div>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-foreground/10 transition-colors opacity-50 hover:opacity-100">
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </div>
          </header>
        )}

        {/* ── BODY ── */}
        <main className="flex-1 flex flex-col items-center relative z-10 px-3 sm:px-6 min-h-0 overflow-y-auto scrollbar-hide py-10 pt-4 md:py-0 md:justify-center">
          <AnimatePresence mode="wait">

            {/* ── SETUP VIEW ── */}
            {!isRunning && (
              <motion.div
                key="setup"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-5"
              >
                {/* LEFT CARDS (DESKTOP) */}
                <div className="hidden lg:flex flex-col gap-3 w-52 xl:w-60 shrink-0">
                  {CATEGORIES.filter(c => c.side === "left").map(cat => (
                    <CatCard key={cat.id} cat={cat} />
                  ))}
                </div>

                {/* ── CENTER ── */}
                <div className="flex flex-col items-center shrink-0 w-full lg:w-auto">
                  <div className="relative flex items-center justify-center mb-4 md:mb-0" style={{ width: clockSize, height: clockSize }}>
                    <ProgressArc progress={isPaused ? progress : 1} size={clockSize} />
                    <VintageWallClock className="w-full h-full" />
                  </div>

                  {/* ── Control band — preset groups + inputs + start ── */}
                  <div className="mt-7 flex flex-col md:flex-row items-stretch md:items-center gap-0 glass border border-foreground/12 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg w-full max-w-[400px] md:max-w-none md:w-auto">

                    {/* LGS group */}
                    <div className="flex flex-col items-start gap-1.5 px-4 py-3 border-b md:border-b-0 md:border-r border-foreground/10">
                      <span className="text-[11px] font-semibold text-foreground/40 tracking-wide mb-0.5">LGS</span>
                      <div className="flex gap-1.5">
                        {PRESET_GROUPS[0].items.map(p => {
                          const idx = PRESETS.findIndex(x => x.label === p.label);
                          return (
                            <button key={p.label} onClick={() => applyTime(p.seconds, idx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${activePreset === idx
                                ? "bg-foreground text-background border-foreground"
                                : "border-foreground/15 text-foreground/55 hover:text-foreground hover:border-foreground/40 hover:bg-foreground/8"
                                }`}>{p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* YKS group */}
                    <div className="flex flex-col items-start gap-1.5 px-4 py-3 border-b md:border-b-0 md:border-r border-foreground/10">
                      <span className="text-[11px] font-semibold text-foreground/40 tracking-wide mb-0.5">YKS</span>
                      <div className="flex gap-1.5">
                        {PRESET_GROUPS[1].items.map(p => {
                          const idx = PRESETS.findIndex(x => x.label === p.label);
                          return (
                            <button key={p.label} onClick={() => applyTime(p.seconds, idx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${activePreset === idx
                                ? "bg-foreground text-background border-foreground"
                                : "border-foreground/15 text-foreground/55 hover:text-foreground hover:border-foreground/40 hover:bg-foreground/8"
                                }`}>{p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom hour:min */}
                    <div className="flex flex-col items-start gap-1.5 px-4 py-3 border-b md:border-b-0 md:border-r border-foreground/10">
                      <span className="text-[11px] font-semibold text-foreground/40 tracking-wide mb-0.5">{t("custom_duration")}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number" min="0" max="23"
                          value={initialTime > 0 ? (Math.floor(initialTime / 3600) || "") : ""}
                          placeholder="00"
                          className="w-12 py-1.5 rounded-xl bg-foreground/5 border border-foreground/15 text-center font-bold text-sm outline-none focus:ring-1 focus:ring-foreground/25 hover:bg-foreground/10 transition-all"
                          onChange={e => setHours(Number(e.target.value) || 0)}
                        />
                        <span className="text-foreground/30 font-bold">:</span>
                        <input
                          type="number" min="0" max="59"
                          value={initialTime > 0 ? (Math.floor((initialTime % 3600) / 60) || "") : ""}
                          placeholder="00"
                          className="w-12 py-1.5 rounded-xl bg-foreground/5 border border-foreground/15 text-center font-bold text-sm outline-none focus:ring-1 focus:ring-foreground/25 hover:bg-foreground/10 transition-all"
                          onChange={e => setMins(Number(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    {/* Start button — prominent */}
                    <div className="flex items-center px-4 py-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={start}
                        disabled={timeLeft === 0}
                        className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${timeLeft === 0
                          ? "bg-foreground/15 text-foreground/25 cursor-not-allowed"
                          : "bg-foreground text-background shadow-foreground/25 hover:shadow-foreground/40 hover:scale-[1.02]"
                          }`}
                      >
                        <Play fill="currentColor" size={15} />
                        {t("start")}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* RIGHT CARDS (DESKTOP) */}
                <div className="hidden lg:flex flex-col gap-3 w-52 xl:w-60 shrink-0">
                  {CATEGORIES.filter(c => c.side === "right").map(cat => (
                    <CatCard key={cat.id} cat={cat} />
                  ))}
                </div>

                {/* MOBILE CARDS (Only on mobile/tablet) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md lg:hidden mt-4 pb-20 px-2">
                  {CATEGORIES.map(cat => <CatCard key={cat.id} cat={cat} />)}
                </div>
              </motion.div>
            )}

            {/* ── RUNNING VIEW ── */}
            {isRunning && (
              <motion.div
                key="running"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", damping: 22, stiffness: 180 }}
                className="flex flex-col items-center justify-center w-full h-full fixed inset-0 bg-mesh-default z-50 px-4"
              >
                <RippleBackground withStars />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-6 opacity-35 tracking-widest uppercase text-xs font-bold">
                    <Target size={14} className="animate-pulse" />
                    {t("focus_process")}
                  </div>
                  <div className="flex items-baseline justify-center font-bold tracking-tighter tabular-nums leading-none">
                    {H > 0 && (
                      <>
                        <span className="text-[5rem] sm:text-[10rem] md:text-[14rem]">{pad(H)}</span>
                        <span className="text-2xl sm:text-6xl md:text-8xl text-foreground/30 mx-2 sm:mx-4 -translate-y-3 sm:-translate-y-8">:</span>
                      </>
                    )}
                    <span className="text-[5rem] sm:text-[10rem] md:text-[14rem]">{pad(M)}</span>
                    <span className="text-2xl sm:text-6xl md:text-8xl text-foreground/30 mx-2 sm:mx-4 -translate-y-3 sm:-translate-y-8">:</span>
                    <span className="text-[5rem] sm:text-[10rem] md:text-[14rem] text-foreground/70">{pad(S)}</span>
                  </div>
                  <div className="w-64 h-0.5 bg-foreground/10 rounded-full mt-6 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000 ease-linear"
                      style={{ background: progress > 0.5 ? "#22c55e" : progress > 0.2 ? "#f59e0b" : "#ef4444", width: `${progress * 100}%` }} />
                  </div>
                  <div className="flex items-center gap-3 mt-10">
                    <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={stop}
                      className="px-6 py-3 rounded-2xl glass border border-foreground/15 text-foreground font-semibold text-sm flex items-center gap-2 hover:bg-foreground/15 transition-all">
                      <RotateCcw size={16} /> {t("stop")}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={pause}
                      className="px-8 py-3 rounded-2xl bg-foreground text-background font-bold text-sm shadow-lg shadow-foreground/25 flex items-center gap-2">
                      <Pause fill="currentColor" size={16} /> {t("pause")}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Pause banner */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 glass px-5 py-3 rounded-2xl shadow-xl border border-foreground/10"
            >
              <span className="text-sm font-bold opacity-70">{t("paused")} — {pad(H)}:{pad(M)}:{pad(S)}</span>
              <motion.button whileTap={{ scale: 0.95 }} onClick={start}
                className="px-4 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold flex items-center gap-1">
                <Play fill="currentColor" size={12} /> {t("resume")}
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={stop}
                className="px-4 py-1.5 rounded-xl glass border border-foreground/15 text-xs font-semibold flex items-center gap-1">
                <RotateCcw size={12} /> {t("reset")}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!isRunning && (
          <footer className="w-full flex justify-center py-2 relative z-10 shrink-0">
            <span className="text-[9px] text-foreground/18 font-medium tracking-[0.22em] uppercase select-none">
              {t("design_by")} <span className="font-bold text-foreground/30">MRK</span>
            </span>
          </footer>
        )}
      </div>

      {/* ── SEO SECTION ── */}
      {!isRunning && (
        <section className="w-full shrink-0 border-t border-foreground/5 bg-background/40 backdrop-blur-3xl py-20 pb-32 relative z-10">
          <article className="max-w-3xl mx-auto px-6 text-foreground/80 flex flex-col gap-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("seo_home_t1")}</h2>
              <p className="text-[15px] leading-relaxed opacity-90">
                {t("seo_home_p1")}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold tracking-tight text-foreground">{t("seo_home_t2")}</h3>
              <p className="text-[15px] leading-relaxed opacity-90">
                {t("seo_home_p2")}
              </p>
            </div>
          </article>
        </section>
      )}

    </div>
  );
}

function CatCard({ cat }: { cat: CatItem; compact?: boolean }) {
  const Icon = cat.icon;
  return (
    <Link
      href={cat.href}
      className="group flex flex-col items-start p-4 md:p-5 rounded-3xl glass border border-foreground/10 shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all w-full"
    >
      <div className="p-2.5 md:p-3 mb-3 md:mb-4 rounded-2xl glass group-hover:bg-foreground group-hover:text-background transition-colors">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <span className="text-[14px] md:text-[16px] font-semibold tracking-tight group-hover:text-foreground/80 transition-colors leading-snug">{cat.name}</span>
      <span className="text-[11px] md:text-[12px] text-foreground/45 font-medium tracking-wide mt-1 leading-snug">{cat.desc}</span>
    </Link>
  );
}
