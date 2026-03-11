"use client";

import { Navbar } from "@/components/Navbar";
import { TabBar } from "@/components/TabBar";
import { AmbientSoundPlayer } from "@/components/AmbientSoundPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Trash2, Plus, Calendar } from "lucide-react";

interface SpecialEvent {
    id: string;
    name: string;
    date: string;
}

export default function SpecialEventsPage() {
    const [events, setEvents] = useState<SpecialEvent[]>([]);
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const stored = localStorage.getItem("focasTimeEvents");
        if (stored) {
            setEvents(JSON.parse(stored));
        } else {
            // Default demo events
            const defaultEvents = [
                { id: "1", name: "2027 Yılbaşı", date: "2027-01-01T00:00:00" },
            ];
            setEvents(defaultEvents);
            localStorage.setItem("focasTimeEvents", JSON.stringify(defaultEvents));
        }
    }, []);

    const handleAddEvent = () => {
        if (!eventName || !eventDate) return;

        const newEvent: SpecialEvent = {
            id: Date.now().toString(),
            name: eventName,
            date: eventDate,
        };

        const updatedEvents = [...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(updatedEvents);
        localStorage.setItem("focasTimeEvents", JSON.stringify(updatedEvents));
        setEventName("");
        setEventDate("");
    };

    const handleDelete = (id: string) => {
        const updatedEvents = events.filter(e => e.id !== id);
        setEvents(updatedEvents);
        localStorage.setItem("focasTimeEvents", JSON.stringify(updatedEvents));
    };

    // Calculate time left
    const getTimeLeft = (dateStr: string) => {
        const difference = new Date(dateStr).getTime() - new Date().getTime();
        if (difference < 0) return "Süresi Doldu";

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

        if (days > 0) return `${days} Gün, ${hours} Saat Kaldı`;

        const minutes = Math.floor((difference / 1000 / 60) % 60);
        return `${hours} Saat, ${minutes} Dakika Kaldı`;
    };

    return (
        <main className="min-h-screen bg-mesh-default relative flex flex-col items-center justify-start p-4 pt-32 pb-32 overflow-y-auto transition-colors duration-1000">
            <Navbar />

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 px-4">

                {/* Form Section */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, x: -20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="glass-panel p-8 sm:p-12 flex flex-col items-start justify-center gap-6 h-fit sticky top-32"
                >
                    <div className="flex items-center gap-3 text-foreground/50 uppercase tracking-widest font-bold text-sm">
                        <Calendar size={18} /> Etkinlik Oluştur
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
                        Geri Sayım Başlat
                    </h1>

                    <div className="w-full">
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Etkinlik Adı (Doğum Günü...)"
                            className="w-full bg-foreground/5 border border-foreground/10 text-foreground rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 ring-foreground/20 mb-4 transition-all"
                        />
                        <input
                            type="datetime-local"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full bg-foreground/5 border border-foreground/10 text-foreground rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 ring-foreground/20 mb-8 transition-all"
                        />
                        <button
                            onClick={handleAddEvent}
                            disabled={!eventName || !eventDate}
                            className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-semibold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            <Plus size={20} /> Kaydet ve Başlat
                        </button>
                    </div>
                </motion.div>

                {/* List Section */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex flex-col gap-4"
                >
                    <div className="glass-panel p-6 pb-2 border-b-0 rounded-b-none bg-background/20 mb-[-1rem] z-20 sticky top-32">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="text-foreground/50" /> Takvimim
                        </h2>
                    </div>
                    <div className="space-y-4 pt-4 relative z-10">
                        {isClient && events.length === 0 && (
                            <div className="glass-panel p-8 text-center text-foreground/50 border border-dashed border-foreground/20 italic">
                                Henüz bir etkinlik eklenmedi.
                            </div>
                        )}
                        <AnimatePresence>
                            {isClient && events.map((event) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-panel p-6 flex flex-col gap-2 relative group overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-foreground/10 transition-colors"></div>
                                    <div className="flex justify-between items-start z-10">
                                        <h3 className="text-xl font-bold truncate pr-8">{event.name}</h3>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-colors shrink-0"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="text-foreground/50 font-medium text-sm flex items-center gap-2 z-10">
                                        {new Date(event.date).toLocaleDateString("tr-TR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                    <div className="mt-4 text-2xl font-black bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent z-10">
                                        {getTimeLeft(event.date)}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

            </div>

            <AmbientSoundPlayer />
            <TabBar />
        </main>
    );
}
