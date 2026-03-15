"use client";

import { useState, useEffect, useRef } from "react";
import { TabBar } from "@/components/TabBar";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingCircle } from "@/components/BreathingCircle";
import { RotateCcw, CloudRain, Flame, Wind, Rocket, Sparkles, Volume2, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { HomeButton } from "@/components/HomeButton";

const ZEN_QUOTES: Record<string, string[]> = {
    tr: [
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
    ],
    en: [
        "The mind is like water. When it is turbulent, it's difficult to see. When it is calm, everything becomes clear.",
        "Forget yesterday, let go of tomorrow. Only exist in this moment.",
        "Silence is not empty, it's full of answers.",
        "If you hurry you'll only get tired. Slow down and enjoy the journey.",
        "Don't let your thoughts be your master, let them be your guests.",
        "True peace is not in the end of the storm, but in staying calm in the storm.",
        "A flower needs only time and sun to bloom. Give yourself time too.",
        "Don't forget to live the path you walk by thinking about where you're going.",
        "If a problem has a solution, don't worry. If it has no solution, what's the use of worrying?",
        "He who wants to move the mountain starts by carrying small stones.",
    ],
};

const getPrograms = (t: (s: string) => string) => [
    { id: "4-7-8", label: "4-7-8", phases: [4, 7, 8], desc: "Stres atma · Uyku", color: "#818cf8" },
    { id: "box", label: t("box_breathing"), phases: [4, 4, 4, 4], desc: "Odaklanma · Sakinleşme", color: "#34d399" },
    { id: "2-1-4-1", label: "2-1-4-1", phases: [2, 1, 4, 1], desc: "Hızlı rahatlama", color: "#fb923c" },
    { id: "deep", label: t("deep_breathing"), phases: [6, 0, 8, 0], desc: "Meditasyon", color: "#e879f9" },
];

const getPhaseLabels = (t: (s: string) => string) => [t("breathe_in"), t("hold"), t("breathe_out"), t("wait")];

const getSounds = (t: (s: string) => string) => [
    { id: "rain", name: t("rain"), icon: CloudRain, url: "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" },
    { id: "fire", name: t("fire"), icon: Flame, url: "https://actions.google.com/sounds/v1/ambiences/fire.ogg" },
    { id: "wind", name: t("wind"), icon: Wind, url: "https://actions.google.com/sounds/v1/weather/winter_wind.ogg" },
    { id: "space", name: t("space_sound"), icon: Rocket, url: "https://actions.google.com/sounds/v1/science_fiction/deep_space_hum.ogg" },
];

export default function MeditasyonPage() {
    const { t, language, setLanguage } = useLanguage();
    const PROGRAMS = getPrograms(t);
    const PHASE_LABELS = getPhaseLabels(t);
    const SOUNDS = getSounds(t);
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
    const motivations = ZEN_QUOTES[language] || ZEN_QUOTES["en"];
    const quote = motivations[dayOfYear % motivations.length];

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
    const activeLabel = PHASE_LABELS[phase] ?? t("breathe_in");
    const timeRemain = currentPhaseDur - phaseTime;
    const fmtTotal = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

    return (
        <div className="bg-mesh-default min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="flex flex-col min-h-screen shrink-0 relative z-10 w-full">
                {/* Program selector header */}
                <header className="flex-none w-full px-4 py-3 backdrop-blur-md bg-background/70 border-b border-foreground/5 z-30 flex items-center justify-center min-h-[60px] md:min-h-[70px]">
                    <div className="absolute left-4">
                        <HomeButton />
                    </div>

                    <div className="flex gap-1 p-1 glass rounded-2xl border border-foreground/10 shadow-md overflow-x-auto scrollbar-hide mx-auto max-w-[75%] sm:max-w-none">
                        {PROGRAMS.map(p => (
                            <button key={p.id} onClick={() => setProgramId(p.id)}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap ${programId === p.id
                                    ? "bg-foreground text-background shadow-sm"
                                    : "text-foreground/45 hover:text-foreground"
                                    }`}>
                                <span>{p.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="absolute right-4 flex items-center gap-2">
                        <button
                            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
                            className="p-2 rounded-full hover:bg-foreground/10 transition-colors opacity-50 hover:opacity-100 flex items-center gap-1.5 glass border border-foreground/10"
                        >
                            <Languages size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{language}</span>
                        </button>
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
                            phase={phase}
                            onClick={() => setRunning(r => !r)}
                        />
                    </div>

                    {/* Stats & Reset Row */}
                    <div className="flex items-center gap-8 shrink-0 mt-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold tabular-nums h-8 flex items-center justify-center">{cycles}</div>
                            <div className="text-[12px] font-semibold tracking-wide text-foreground/45 mt-1">{t("cycle")}</div>
                        </div>
                        <div className="w-px h-8 bg-foreground/10" />

                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={reset}
                            className="p-4 rounded-full glass border border-foreground/15 hover:bg-foreground/15 transition-colors text-foreground/60 hover:text-foreground">
                            <RotateCcw size={20} />
                        </motion.button>

                        <div className="w-px h-8 bg-foreground/10" />
                        <div className="text-center">
                            <div className="text-2xl font-bold tabular-nums h-8 flex items-center justify-center">{fmtTotal(totalSecs)}</div>
                            <div className="text-[12px] font-semibold tracking-wide text-foreground/45 mt-1">{t("duration")}</div>
                        </div>
                    </div>

                </main>

                {/* Floating Ambient Sounds */}
                <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 pointer-events-auto items-center">
                    {SOUNDS.map(snd => {
                        const Icon = snd.icon;
                        const isActive = activeSound === snd.id;
                        return (
                            <button
                                key={snd.id}
                                onClick={() => toggleSound(snd.id)}
                                className={`w-12 h-12 rounded-full transition-all flex items-center justify-center border shadow-xl ${isActive
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
            </div>

            {/* ── SEO SECTION ── */}
            <section className="w-full shrink-0 border-t border-foreground/5 bg-background/40 backdrop-blur-3xl py-20 pb-32 relative z-10">
                <article className="max-w-3xl mx-auto px-6 text-foreground/80 flex flex-col gap-8">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("seo_med_t1")}</h2>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            {t("seo_med_p1")}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">{t("seo_med_t2")}</h3>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            {t("seo_med_p2")}
                        </p>
                    </div>
                </article>
            </section>

            <div className="fixed bottom-0 inset-x-0 flex justify-center pb-3 pt-4 bg-gradient-to-t from-background/95 to-transparent z-40 pointer-events-none">
                <div className="pointer-events-auto"><TabBar /></div>
            </div>
        </div >
    );
}
