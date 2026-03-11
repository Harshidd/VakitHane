"use client";

import { Navbar } from "@/components/Navbar";
import { TabBar } from "@/components/TabBar";
import { AmbientSoundPlayer } from "@/components/AmbientSoundPlayer";
import { BreathingCircle } from "@/components/BreathingCircle";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function MeditationPage() {
    const [dailyZen, setDailyZen] = useState("");

    const zenQuotes = [
        "Zihin bir su gibidir. Bulandığında görmek zordur, durulduğunda ise her şey berraklaşır.",
        "Dünü unut, yarını bırak. Sadece bu anın içinde var ol.",
        "Sessizlik boş değildir, cevaplarla doludur.",
        "Acele edersen sadece yorulursun. Yavaşla ve yolun tadını çıkar.",
        "Düşüncelerin efendin değil, misafirin olsun. Bırak gelsinler ve gitsinler.",
        "Dağı taşımak isteyen, işe küçük taşları taşıyarak başlar.",
        "Eğer bir sorunun çözümü varsa endişelenme. Çözümü yoksa, endişelenmenin faydası nedir?",
        "Gerçek huzur fırtınanın bitmesinde değil, fırtınada sakin kalabilmektedir.",
        "Bir çiçeğin açması için sadece zamana ve güneşe ihtiyacı vardır. Sen de kendine zaman tanı.",
        "Gideceğin yeri düşünmekten, yürüdüğün yolu yaşamayı unutma."
    ];

    useEffect(() => {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        setDailyZen(zenQuotes[dayOfYear % zenQuotes.length]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <main className="min-h-screen bg-mesh-default relative flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden transition-colors duration-1000">
            <Navbar />

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl px-6 py-12 sm:p-16 text-center flex flex-col items-center justify-center gap-12 relative z-10"
            >
                <div className="absolute top-0 opacity-10">
                    <h1 className="text-8xl sm:text-[12rem] font-bold tracking-tighter blur-sm select-none pointer-events-none">Zen.</h1>
                </div>

                <h2 className="text-2xl font-medium tracking-tight bg-gradient-to-r from-foreground/50 to-foreground/80 bg-clip-text text-transparent">
                    Derin Bir Nefes Alın
                </h2>

                {dailyZen && (
                    <div className="mt-4 italic text-foreground/60 font-serif text-sm sm:text-base max-w-md bg-foreground/5 p-4 rounded-2xl border border-foreground/10 shadow-sm">
                        "{dailyZen}"
                        <div className="mt-2 text-[10px] uppercase tracking-widest text-foreground/40 font-sans not-italic">Günün Zen Öğüdü</div>
                    </div>
                )}

                <div className="py-12">
                    <BreathingCircle />
                </div>

            </motion.div>

            <AmbientSoundPlayer />
            <TabBar />
        </main>
    );
}
