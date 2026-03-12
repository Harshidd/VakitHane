"use client";

import { useState, useEffect, useRef } from "react";
import { TabBar } from "@/components/TabBar";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingCircle } from "@/components/BreathingCircle";
import { RotateCcw, CloudRain, Flame, Wind, Rocket, Sparkles, Volume2 } from "lucide-react";

const ZEN_QUOTES = [
    "Zihin bir su gibidir. Bulandığında görmek zordur, durulduğunda ise her şey berraklaşır.",
    "Dünü unut, yarını bırak. Sadece bu anın içinde var ol.",
    "Sessizlik boş değildir, cevaplarla doludur.",
    "Acele edersen sadece yorulursun. Yavaşla ve yolun tadını çıkar.",
    "Düşüncelerin efendin değil, misafirin olsun.",
    "Gerçek huzur fırtınanın bitmesinde değil, fırtınada sakin kalabilmektedir.",
    "Bir çiçeğin açması için sadece zamana ve güneşe ihtiyacı var. Sen de kendine zaman tanı.",
    "Gideceğin yeri düşünmekten, yürüdüğün yolu yaşamayı unutma.",
    "Eğer bir sorunun çözümü varsa endişelenme. Çözümü yoksa, endişelenmenin faydası nedir?",
    "Dağı taşımak isteyen, işe küçük taşları taşıyarak başlar.",
];

const PROGRAMS = [
    { id: "4-7-8", label: "4-7-8", phases: [4, 7, 8], desc: "Stres atma · Uyku", color: "#818cf8" },
    { id: "box", label: "Kare Nefes", phases: [4, 4, 4, 4], desc: "Odaklanma · Sakinleşme", color: "#34d399" },
    { id: "2-1-4-1", label: "2-1-4-1", phases: [2, 1, 4, 1], desc: "Hızlı rahatlama", color: "#fb923c" },
    { id: "deep", label: "Derin Nefes", phases: [6, 0, 8, 0], desc: "Meditasyon", color: "#e879f9" },
];

const PHASE_LABELS = ["Nefes Al", "Tut", "Nefes Ver", "Bekle"];

const SOUNDS = [
    { id: "rain", name: "Yağmur", icon: CloudRain, url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" },
    { id: "fire", name: "Şömine", icon: Flame, url: "https://actions.google.com/sounds/v1/ambiences/fire.ogg" },
    { id: "wind", name: "Rüzgar", icon: Wind, url: "https://actions.google.com/sounds/v1/weather/winter_wind.ogg" },
    { id: "space", name: "Uzay", icon: Rocket, url: "https://actions.google.com/sounds/v1/science_fiction/deep_space_hum.ogg" },
];

export default function MeditasyonPage() {
    const [programId, setProgramId] = useState("4-7-8");
    const [running, setRunning] = useState(false);
    const [phase, setPhase] = useState(0);
    const [phaseTime, setPhaseTime] = useState(0);
    const [cycles, setCycles] = useState(0);
    const [totalSecs, setTotalSecs] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Audio setup
    const [activeSound, setActiveSound] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const program = PROGRAMS.find(p => p.id === programId) ?? PROGRAMS[0];
    const phases = program.phases;

    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
    const quote = ZEN_QUOTES[dayOfYear % ZEN_QUOTES.length];

    const reset = () => {
        setRunning(false);
        setPhase(0);
        setPhaseTime(0);
        setCycles(0);
        setTotalSecs(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Switch program → reset
    useEffect(() => { reset(); }, [programId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Timer logic
    useEffect(() => {
        if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }

        intervalRef.current = setInterval(() => {
            setTotalSecs(s => s + 1);
            setPhaseTime(prev => {
                const phaseDur = phases[phase] ?? 0;
                if (phaseDur === 0) {
                    setPhase(p => {
                        const next = (p + 1) % phases.length;
                        if (next === 0) setCycles(c => c + 1);
                        return next;
                    });
                    return 0;
                }
                if (prev + 1 >= phaseDur) {
                    setPhase(p => {
                        const next = (p + 1) % phases.length;
                        if (next === 0) setCycles(c => c + 1);
                        return next;
                    });
                    return 0;
                }
                return prev + 1;
            });
        }, 1000);

        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running, phase, phases]);

    // Audio Mount
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        // Clean up global ambient player overlay to not clash
        const extActive = document.body.getAttribute("data-theme");
        if (extActive) {
            setActiveSound(extActive);
            const snd = SOUNDS.find(s => s.id === extActive);
            if (snd) {
                audioRef.current.src = snd.url;
                audioRef.current.play().catch(() => { });
            }
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    const toggleSound = (id: string) => {
        if (!audioRef.current) return;
        if (activeSound === id) {
            setActiveSound(null);
            audioRef.current.pause();
            document.body.removeAttribute("data-theme");
        } else {
            setActiveSound(id);
            document.body.setAttribute("data-theme", id);
            const snd = SOUNDS.find(s => s.id === id);
            if (snd) {
                audioRef.current.src = snd.url;
                audioRef.current.volume = 0.5;
                audioRef.current.play().catch(e => console.log("Play err", e));
            }
        }
    };

    const currentPhaseDur = phases[phase] ?? 1;
    const activeLabel = PHASE_LABELS[phase] ?? "Nefes Al";
    const timeRemain = currentPhaseDur - phaseTime;
    const fmtTotal = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

    return (
        <div className="bg-mesh-default h-screen flex flex-col overflow-hidden">

            {/* Program selector header */}
            <header className="flex-none flex justify-center pt-2 pb-2 backdrop-blur-md bg-background/70 border-b border-foreground/5 z-30">
                <div className="flex gap-1 p-1 glass rounded-2xl border border-foreground/10 shadow-md">
                    {PROGRAMS.map(p => (
                        <button key={p.id} onClick={() => setProgramId(p.id)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${programId === p.id
                                ? "bg-foreground text-background shadow-sm"
                                : "text-foreground/45 hover:text-foreground"
                                }`}>
                            <span>{p.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start px-4 pt-4 pb-24 gap-4 relative z-10 w-full max-w-xl mx-auto min-h-0">

                {/* Zen quote (Moved to TOP, styled like EXAMS tab) */}
                <motion.div
                    key={quote}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start justify-center gap-2 text-center w-full px-2"
                >
                    <Sparkles size={16} className="text-foreground/25 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-foreground/50 italic leading-relaxed">"{quote}"</p>
                    <Sparkles size={16} className="text-foreground/25 shrink-0 mt-0.5" />
                </motion.div>



                {/* Breathing circle — Interactive & Centralized */}
                <div className="relative flex-1 flex items-center justify-center min-h-0 w-full shrink-0">
                    {/* Colored ring behind the circle */}
                    <div className="absolute rounded-full blur-[40px] opacity-20 transition-colors duration-1000 pointer-events-none"
                        style={{ background: program.color, width: 280, height: 280 }} />

                    <BreathingCircle
                        running={running}
                        phaseLabel={activeLabel}
                        phaseDur={currentPhaseDur}
                        color={program.color}
                        timeRemain={timeRemain}
                        onClick={() => setRunning(r => !r)}
                    />
                </div>

                {/* Stats & Reset Row */}
                <div className="flex items-center gap-8 shrink-0 mt-4 mb-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold tabular-nums h-8 flex items-center justify-center">{cycles}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/35">Döngü</div>
                    </div>
                    <div className="w-px h-8 bg-foreground/10" />

                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={reset}
                        className="p-4 rounded-full glass border border-foreground/15 hover:bg-foreground/15 transition-colors text-foreground/60 hover:text-foreground">
                        <RotateCcw size={20} />
                    </motion.button>

                    <div className="w-px h-8 bg-foreground/10" />
                    <div className="text-center">
                        <div className="text-2xl font-bold tabular-nums h-8 flex items-center justify-center">{fmtTotal(totalSecs)}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/35">Süre</div>
                    </div>
                </div>

            </main>

            {/* Floating Ambient Sounds (Right Side) */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 pointer-events-auto">
                {SOUNDS.map(snd => {
                    const Icon = snd.icon;
                    const isActive = activeSound === snd.id;
                    return (
                        <button
                            key={snd.id}
                            onClick={() => toggleSound(snd.id)}
                            className={`p-3 rounded-full transition-all flex items-center justify-center border shadow-lg ${isActive
                                ? "bg-foreground text-background border-transparent scale-110"
                                : "glass border-foreground/15 text-foreground/50 hover:bg-foreground/10 hover:text-foreground"
                                }`}
                            title={snd.name}
                        >
                            <Icon size={20} className={isActive ? "opacity-90 animate-pulse" : "opacity-60"} />
                        </button>
                    );
                })}
            </div>

            <div className="fixed bottom-0 inset-x-0 flex justify-center pb-3 pt-4 bg-gradient-to-t from-background/95 to-transparent z-40 pointer-events-none">
                <div className="pointer-events-auto"><TabBar /></div>
            </div>
        </div >
    );
}
