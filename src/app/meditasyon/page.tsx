"use client";

import { useState, useEffect, useRef } from "react";
import { TabBar } from "@/components/TabBar";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingCircle } from "@/components/BreathingCircle";
import { Play, Pause, RotateCcw, Wind } from "lucide-react";

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

export default function MeditasyonPage() {
    const [programId, setProgramId] = useState("4-7-8");
    const [running, setRunning] = useState(false);
    const [phase, setPhase] = useState(0);
    const [phaseTime, setPhaseTime] = useState(0);
    const [cycles, setCycles] = useState(0);
    const [totalSecs, setTotalSecs] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    useEffect(() => {
        if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }

        intervalRef.current = setInterval(() => {
            setTotalSecs(s => s + 1);
            setPhaseTime(prev => {
                const phaseDur = phases[phase] ?? 0;
                if (phaseDur === 0) {
                    // Skip zero-duration phases
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

    const currentPhaseDur = phases[phase] ?? 1;
    const progress = currentPhaseDur > 0 ? phaseTime / currentPhaseDur : 0;
    const activeLabel = PHASE_LABELS[phase] ?? "Nefes Al";
    const timeRemain = currentPhaseDur - phaseTime;

    const fmtTotal = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

    return (
        <div className="bg-mesh-default h-screen flex flex-col overflow-y-auto overflow-x-hidden">

            {/* Program selector header */}
            <header className="sticky top-0 z-30 flex justify-center pt-4 pb-3 backdrop-blur-md bg-background/70 border-b border-foreground/5">
                <div className="flex gap-1 p-1 glass rounded-2xl border border-foreground/10 shadow-md overflow-x-auto scrollbar-hide">
                    {PROGRAMS.map(p => (
                        <button key={p.id} onClick={() => setProgramId(p.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${programId === p.id
                                ? "bg-foreground text-background shadow-sm"
                                : "text-foreground/45 hover:text-foreground"
                                }`}>
                            <span>{p.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 pb-24 gap-5 relative z-10">

                {/* Program description */}
                <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/35 mb-1 flex items-center justify-center gap-1">
                        <Wind size={10} /> Nefes Tekniği
                    </div>
                    <h1 className="text-2xl font-bold">{program.label}</h1>
                    <p className="text-xs text-foreground/40 font-medium mt-0.5">{program.desc}</p>
                </div>

                {/* Phase info */}
                <AnimatePresence mode="wait">
                    <motion.div key={phase}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        <div className="text-4xl font-bold tracking-tight" style={{ color: running ? program.color : "inherit" }}>
                            {running ? activeLabel : "Hazır"}
                        </div>
                        {running && (
                            <div className="text-lg tabular-nums font-bold mt-1 opacity-60">{timeRemain}s</div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Breathing circle — uses dynamic component */}
                <div className="relative flex items-center justify-center py-6">
                    {/* Colored ring behind the circle */}
                    <div className="absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-1000"
                        style={{ background: program.color, width: 260, height: 260, margin: "auto" }} />
                    <BreathingCircle
                        running={running}
                        phaseLabel={activeLabel}
                        phaseDur={currentPhaseDur}
                        color={program.color}
                    />
                </div>

                {/* Phase progress dots */}
                <div className="flex gap-2 items-center">
                    {phases.map((dur, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className={`h-1.5 rounded-full transition-all duration-500 ${i === phase && running ? "w-8" : "w-4"}`}
                                style={{ background: i === phase && running ? program.color : "rgba(255,255,255,0.15)" }} />
                            {dur > 0 && (
                                <span className="text-[8px] text-foreground/30 font-bold">{PHASE_LABELS[i]?.split(" ")[2] ?? PHASE_LABELS[i]}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Stats — cycles + total time */}
                <div className="flex gap-6 text-center">
                    <div>
                        <div className="text-2xl font-bold tabular-nums">{cycles}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-foreground/35">Döngü</div>
                    </div>
                    <div className="w-px bg-foreground/10" />
                    <div>
                        <div className="text-2xl font-bold tabular-nums">{fmtTotal(totalSecs)}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-foreground/35">Süre</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                    <motion.button whileTap={{ scale: 0.94 }} onClick={reset}
                        className="p-3 rounded-2xl glass border border-foreground/15 hover:bg-foreground/10 transition-colors">
                        <RotateCcw size={18} className="opacity-60" />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
                        onClick={() => setRunning(r => !r)}
                        className="px-10 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
                        style={running
                            ? { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }
                            : { background: program.color, color: "#000" }
                        }
                    >
                        {running ? <><Pause fill="currentColor" size={16} /> Duraklat</> : <><Play fill="currentColor" size={16} /> Başlat</>}
                    </motion.button>
                </div>

                {/* Zen quote */}
                <p className="max-w-sm text-center text-[10px] text-foreground/25 italic font-medium leading-relaxed px-4">
                    "{quote}"
                </p>

            </main>

            <div className="fixed bottom-0 inset-x-0 flex justify-center pb-3 pt-4 bg-gradient-to-t from-background/95 to-transparent z-40 pointer-events-none">
                <div className="pointer-events-auto"><TabBar /></div>
            </div>
        </div>
    );
}
