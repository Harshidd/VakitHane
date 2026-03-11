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

const CATEGORIES: CatItem[] = [
  { id: "school", name: "Okul & Sınavlar", icon: BookOpen, href: "/sinav-sayaci", desc: "Sınav Geri Sayımları", side: "left" },
  { id: "religion", name: "İnanç & İbadet", icon: Moon, href: "/namaz-vakitleri", desc: "Namaz & İftar", side: "left" },
  { id: "stopwatch", name: "Kronometre", icon: Hourglass, href: "/kronometre", desc: "Süre Ölçümü", side: "left" },
  { id: "space", name: "Rahatlama", icon: Wind, href: "/meditasyon", desc: "Nefes & Meditasyon", side: "right" },
  { id: "events", name: "Özel Günler", icon: Calendar, href: "/ozel-gunler", desc: "Etkinlik Sayaçları", side: "right" },
  { id: "worldclock", name: "Dünya Saatleri", icon: Globe2, href: "/dunya-saatleri", desc: "Şehirler & Saat Dilimleri", side: "right" },
];

const CLOCK_SIZE = 340;

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [stats, setStats] = useState({ sessions: 0, totalSeconds: 0 });
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const playChime = useCompletionSound();
  useNotificationPermission();

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
    <div className="bg-mesh-default relative flex flex-col h-screen overflow-hidden">
      <RippleBackground />

      {/* ── HEADER ── */}
      {!isRunning && (
        <header className="w-full flex items-center justify-between px-5 py-2.5 z-50 relative shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <div className="group flex items-center gap-2 cursor-pointer">
              <div className="bg-foreground text-background p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-md">
                <Timer size={14} />
              </div>
              <span className="font-semibold text-sm tracking-tight hidden sm:block">VakitHane</span>
            </div>
            {stats.sessions > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass border border-foreground/10 text-xs font-semibold text-foreground/60"
              >
                <Flame size={11} className="text-orange-400" />
                <span>{stats.sessions} seans</span>
                <span className="opacity-40">·</span>
                <Clock4 size={11} className="opacity-60" />
                <span>{formatTotal(stats.totalSeconds)}</span>
              </motion.div>
            )}
          </div>

          <TabBar inline />

          <div className="flex gap-1 items-center shrink-0">
            <button className="p-2 rounded-full hover:bg-foreground/10 transition-colors opacity-50 hover:opacity-100">
              <Settings size={14} />
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-foreground/10 transition-colors opacity-50 hover:opacity-100">
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>
      )}

      {/* ── BODY ── */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-3 sm:px-6 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">

          {/* ── SETUP VIEW ── */}
          {!isRunning && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-7xl flex items-center justify-center gap-4 lg:gap-5"
            >
              {/* LEFT CARDS */}
              <div className="hidden lg:flex flex-col gap-3 w-52 xl:w-60 shrink-0">
                {CATEGORIES.filter(c => c.side === "left").map(cat => (
                  <CatCard key={cat.id} cat={cat} />
                ))}
              </div>

              {/* ── CENTER ── */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative flex items-center justify-center" style={{ width: CLOCK_SIZE, height: CLOCK_SIZE }}>
                  <ProgressArc progress={isPaused ? progress : 1} size={CLOCK_SIZE} />
                  <VintageWallClock className="w-full h-full" />
                </div>

                {/* ── Control band — preset groups + inputs + start ── */}
                <div className="mt-7 flex items-stretch gap-0 glass border border-foreground/12 rounded-2xl overflow-hidden shadow-lg">

                  {/* LGS group */}
                  <div className="flex flex-col items-start gap-1.5 px-4 py-3 border-r border-foreground/10">
                    <span className="text-[9px] font-extrabold text-foreground/30 uppercase tracking-widest">LGS</span>
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
                  <div className="flex flex-col items-start gap-1.5 px-4 py-3 border-r border-foreground/10">
                    <span className="text-[9px] font-extrabold text-foreground/30 uppercase tracking-widest">YKS</span>
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
                  <div className="flex flex-col items-start gap-1.5 px-4 py-3 border-r border-foreground/10">
                    <span className="text-[9px] font-extrabold text-foreground/30 uppercase tracking-widest">Özel Süre</span>
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
                      className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${timeLeft === 0
                        ? "bg-foreground/15 text-foreground/25 cursor-not-allowed"
                        : "bg-foreground text-background shadow-foreground/25 hover:shadow-foreground/40 hover:scale-[1.02]"
                        }`}
                    >
                      <Play fill="currentColor" size={15} />
                      Başlat
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* RIGHT CARDS */}
              <div className="hidden lg:flex flex-col gap-3 w-52 xl:w-60 shrink-0">
                {CATEGORIES.filter(c => c.side === "right").map(cat => (
                  <CatCard key={cat.id} cat={cat} />
                ))}
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
                  Odaklanma Süreci
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
                    <RotateCcw size={16} /> Durdur
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={pause}
                    className="px-8 py-3 rounded-2xl bg-foreground text-background font-bold text-sm shadow-lg shadow-foreground/25 flex items-center gap-2">
                    <Pause fill="currentColor" size={16} /> Duraklat
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* MOBILE CARDS */}
        {!isRunning && (
          <div className="absolute bottom-10 left-0 right-0 grid grid-cols-2 gap-2 px-4 lg:hidden">
            {CATEGORIES.slice(0, 4).map(cat => <CatCard key={cat.id} cat={cat} compact />)}
          </div>
        )}
      </main>

      {/* Pause banner */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 glass px-5 py-3 rounded-2xl shadow-xl border border-foreground/10"
          >
            <span className="text-sm font-bold opacity-70">Duraklatıldı — {pad(H)}:{pad(M)}:{pad(S)}</span>
            <motion.button whileTap={{ scale: 0.95 }} onClick={start}
              className="px-4 py-1.5 rounded-xl bg-foreground text-background text-xs font-bold flex items-center gap-1">
              <Play fill="currentColor" size={12} /> Devam
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={stop}
              className="px-4 py-1.5 rounded-xl glass border border-foreground/15 text-xs font-semibold flex items-center gap-1">
              <RotateCcw size={12} /> Sıfırla
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!isRunning && (
        <footer className="w-full flex justify-center py-2 relative z-10 shrink-0">
          <span className="text-[9px] text-foreground/18 font-medium tracking-[0.22em] uppercase select-none">
            design by <span className="font-bold text-foreground/30">MRK</span>
          </span>
        </footer>
      )}
    </div>
  );
}

function CatCard({ cat, compact }: { cat: CatItem; compact?: boolean }) {
  const Icon = cat.icon;
  return (
    <Link
      href={cat.href}
      className={`group flex flex-col ${compact ? "items-center text-center" : "items-start"} p-4 rounded-2xl glass border border-foreground/10 shadow-sm hover:scale-[1.02] hover:shadow-lg transition-all duration-200 w-full`}
    >
      <div className="p-2.5 rounded-xl glass mb-3 group-hover:bg-foreground group-hover:text-background transition-colors duration-200">
        <Icon size={compact ? 17 : 20} strokeWidth={1.5} />
      </div>
      <span className={`${compact ? "text-xs" : "text-sm"} font-bold tracking-tight group-hover:text-foreground/80 transition-colors leading-tight`}>{cat.name}</span>
      {!compact && <span className="text-[10px] text-foreground/35 font-medium uppercase tracking-widest mt-1.5 leading-tight">{cat.desc}</span>}
    </Link>
  );
}
