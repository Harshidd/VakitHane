"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { TabBar } from "@/components/TabBar";
import { AmbientSoundPlayer } from "@/components/AmbientSoundPlayer";
import { motion } from "framer-motion";

export default function ExamTimerPage() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [dailyQuote, setDailyQuote] = useState("");

    const quotes = [
        "Bugün döktüğün ter, yarınki başarına dönüşecek. Asla pes etme!",
        "Ertelediğin her gün, hayallerinden bir gün çalar. Şimdi başla.",
        "Senin için imkansız diyenlere, başararak cevap ver.",
        "Büyük başarılar, küçük ama sürekli adımlarla gelir.",
        "Zorluklar, yeteneklerini uyandıran kıvılcımlardır.",
        "Masanın başında geçirdiğin her saat, geleceğine yaptığın en büyük yatırımdır.",
        "Vazgeçmeyi düşündüğünde, neden başladığını hatırla.",
        "Yorgunluk geçer, geriye zaferin gururu kalır.",
        "Hayallerinin büyüklüğü, çabanın büyüklüğüyle ölçülür.",
        "Şansa inanma, sadece disipline ve çok çalışmaya inan.",
    ];

    useEffect(() => {
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        setDailyQuote(quotes[dayOfYear % quotes.length]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Example dates
    const exams = [
        { name: "YKS 2026", date: new Date("2026-06-20T10:15:00") },
        { name: "LGS 2026", date: new Date("2026-06-06T09:30:00") },
        { name: "KPSS Lisans", date: new Date("2026-07-12T10:15:00") }
    ];

    const [selectedExam, setSelectedExam] = useState(exams[0]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = selectedExam.date.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [selectedExam]);

    return (
        <main className="min-h-screen bg-mesh-default relative flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden transition-colors duration-1000">
            <Navbar />

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel w-full max-w-4xl px-4 py-12 sm:p-16 text-center flex flex-col items-center justify-center gap-12 relative z-10"
            >
                {dailyQuote && (
                    <div className="absolute top-0 transform -translate-y-10 sm:-translate-y-12 bg-background/80 backdrop-blur-md px-6 py-3 rounded-full border border-foreground/10 shadow-lg italic text-foreground/80 font-serif text-sm sm:text-base text-center w-[90%] md:w-auto z-20">
                        "{dailyQuote}"
                    </div>
                )}

                <div className="flex gap-2 p-1.5 bg-foreground/5 rounded-full overflow-hidden w-full max-w-lg mb-4 flex-wrap justify-center mt-6">
                    {exams.map((exam) => (
                        <button
                            key={exam.name}
                            onClick={() => setSelectedExam(exam)}
                            className={`py-2 px-6 rounded-full text-sm font-medium transition-all ${selectedExam.name === exam.name
                                ? "bg-foreground text-background shadow-md"
                                : "text-foreground/60 hover:text-foreground"
                                }`}
                        >
                            {exam.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full">
                    {[
                        { label: "Gün", value: timeLeft.days },
                        { label: "Saat", value: timeLeft.hours },
                        { label: "Dakika", value: timeLeft.minutes },
                        { label: "Saniye", value: timeLeft.seconds },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center justify-center bg-foreground/5 rounded-3xl py-8 px-4 border border-foreground/5 shadow-inner">
                            <span className="text-5xl sm:text-7xl font-bold tracking-tighter tabular-nums text-foreground/90">
                                {item.value.toString().padStart(2, '0')}
                            </span>
                            <span className="text-foreground/50 text-sm font-medium uppercase tracking-widest mt-2">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="text-foreground/60 font-medium">
                    Hedef: {selectedExam.date.toLocaleDateString("tr-TR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

            </motion.div>

            <AmbientSoundPlayer />
            <TabBar />
        </main>
    );
}
