"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Flag, Timer } from "lucide-react";
import Link from "next/link";
import { TabBar } from "@/components/TabBar";

interface Lap { n: number; time: number; delta: number; }

export default function KronometrePage() {
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const [laps, setLaps] = useState<Lap[]>([]);
    const lastLapRef = useRef(0);
    const startRef = useRef<number | null>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (running) {
            const base = Date.now() - elapsed;
            const tick = () => {
                setElapsed(Date.now() - base);
                rafRef.current = requestAnimationFrame(tick);
            };
            rafRef.current = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(rafRef.current);
        }
        return () => cancelAnimationFrame(rafRef.current);
    }, [running]);

    const toggle = () => setRunning(r => !r);
    const reset = () => { setRunning(false); setElapsed(0); setLaps([]); lastLapRef.current = 0; };
    const addLap = () => {
        const delta = elapsed - lastLapRef.current;
        setLaps(prev => [{ n: prev.length + 1, time: elapsed, delta }, ...prev]);
        lastLapRef.current = elapsed;
    };

    const fmt = (ms: number) => {
        const totalMs = Math.floor(ms);
        const m = Math.floor(totalMs / 60000);
        const s = Math.floor((totalMs % 60000) / 1000);
        const cs = Math.floor((totalMs % 1000) / 10);
        return { m: String(m).padStart(2, "0"), s: String(s).padStart(2, "0"), cs: String(cs).padStart(2, "0") };
    };

    const { m, s, cs } = fmt(elapsed);
    const best = laps.length ? Math.min(...laps.map(l => l.delta)) : null;
    const worst = laps.length ? Math.max(...laps.map(l => l.delta)) : null;

    return (
        <div className="bg-mesh-default min-h-screen overflow-y-auto overflow-x-hidden scrollbar-hide">
            <div className="flex flex-col min-h-screen shrink-0 w-full relative z-10 items-center justify-start px-4 py-8">
                {/* Back */}
                <header className="w-full max-w-lg flex items-center justify-between mb-10">
                    <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity text-sm font-semibold">
                        <Timer size={18} /> VakitHane
                    </Link>
                    <span className="text-[13px] text-foreground/45 tracking-wide font-semibold">Kronometre</span>
                </header>

                {/* Big display */}
                <motion.div
                    className="flex items-baseline justify-center font-bold tabular-nums leading-none select-none mb-10"
                    animate={{ scale: running ? [1, 1.002, 1] : 1 }}
                    transition={{ duration: 1, repeat: running ? Infinity : 0 }}
                >
                    <span className="text-[6rem] sm:text-[9rem] md:text-[12rem] tracking-tighter">{m}:{s}</span>
                    <span className="text-[2.5rem] sm:text-[4rem] md:text-[5rem] text-foreground/40 ml-2 tracking-tight">.{cs}</span>
                </motion.div>

                {/* Controls */}
                <div className="flex items-center gap-4 mb-10">
                    {/* Lap */}
                    <motion.button
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        onClick={addLap}
                        disabled={!running}
                        className="px-5 py-3 rounded-2xl glass border border-foreground/15 font-semibold text-sm flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/10 transition-all"
                    >
                        <Flag size={16} /> Tur
                    </motion.button>

                    {/* Start / Pause */}
                    <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={toggle}
                        className={`px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 shadow-lg transition-all ${running
                            ? "bg-amber-500 text-white shadow-amber-500/30"
                            : "bg-foreground text-background shadow-foreground/20"
                            }`}
                    >
                        {running ? <><Pause fill="currentColor" size={20} /> Duraklat</> : <><Play fill="currentColor" size={20} /> Başlat</>}
                    </motion.button>

                    {/* Reset */}
                    <motion.button
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        onClick={reset}
                        className="px-5 py-3 rounded-2xl glass border border-foreground/15 font-semibold text-sm flex items-center gap-2 hover:bg-foreground/10 transition-all"
                    >
                        <RotateCcw size={16} /> Sıfırla
                    </motion.button>
                </div>

                {/* Laps */}
                {laps.length > 0 && (
                    <div className="w-full max-w-md">
                        <div className="flex items-center justify-between text-[12px] tracking-wide text-foreground/50 font-semibold px-4 mb-2">
                            <span>Tur</span>
                            <span>Tur Süresi</span>
                            <span>Toplam</span>
                        </div>
                        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto scrollbar-hide">
                            {laps.map(lap => {
                                const isBest = best !== null && lap.delta === best && laps.length > 1;
                                const isWorst = worst !== null && lap.delta === worst && laps.length > 1;
                                const { m: lm, s: ls, cs: lcs } = fmt(lap.delta);
                                const { m: tm, s: ts, cs: tcs } = fmt(lap.time);
                                return (
                                    <motion.div
                                        key={lap.n}
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex items-center justify-between px-4 py-3 rounded-2xl glass border transition-all ${isBest ? "border-green-400/50 text-green-400" :
                                            isWorst ? "border-red-400/50   text-red-400" :
                                                "border-foreground/8 text-foreground"
                                            }`}
                                    >
                                        <span className="font-bold w-8 opacity-50 text-sm">#{lap.n}</span>
                                        <span className="font-bold font-mono tabular-nums text-sm">{lm}:{ls}.{lcs}</span>
                                        <span className="font-mono tabular-nums text-xs opacity-50">{tm}:{ts}.{tcs}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ── SEO SECTION ── */}
            <section className="w-full shrink-0 border-t border-foreground/5 bg-background/40 backdrop-blur-3xl py-20 pb-32 relative z-10">
                <article className="max-w-3xl mx-auto px-6 text-foreground/80 flex flex-col gap-8">
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Online Hassas Kronometre ve Tur Sayacı</h2>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            Spor yaparken, yemek hazırlarken veya çalışma sürelerinizi analiz ederken ihtiyacınız olan hassasiyeti <strong>VakitHane Online Kronometre</strong> ile yakalayın. Milisaniye düzeyinde doğruluk payı ve tek tıkla tur (lap) ekleme özelliği sayesinde performansınızı anlık olarak takip edebilirsiniz.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">Verimlilik ve Süre Analizi</h3>
                        <p className="text-[15px] leading-relaxed opacity-90">
                            Minimalist tasarımı ve kullanım kolaylığı ile ön plana çıkan kronometremiz, en iyi ve en kötü tur sürelerinizi otomatik olarak işaretler. Reklamsız ve pürüzsüz arayüzümüz, tarayıcınız kapansa bile performansınızı etkilemeden arka planda çalışabilecek stabilitelikte tasarlanmıştır.
                        </p>
                    </div>
                </article>
            </section>

            <div className="fixed bottom-0 inset-x-0 flex justify-center pb-3 pt-4 bg-gradient-to-t from-background/95 to-transparent z-40 pointer-events-none w-full">
                <div className="pointer-events-auto"><TabBar /></div>
            </div>
        </div >
    );
}
