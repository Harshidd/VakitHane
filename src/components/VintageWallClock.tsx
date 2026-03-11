"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function VintageWallClock({ className = "" }: { className?: string }) {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return <div className={`w-full max-w-[280px] aspect-square mx-auto opacity-0 ${className}`}></div>;

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const secondAngle = seconds * 6;
    const minuteAngle = minutes * 6 + seconds * 0.1;
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;

    const numerals = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

    return (
        <div className={`relative flex items-center justify-center select-none w-full max-w-[260px] sm:max-w-[340px] md:max-w-[400px] aspect-square mx-auto ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-full shadow-2xl flex items-center justify-center p-3 sm:p-5 ring-4 sm:ring-8 ring-foreground/10">
                <div className="w-full h-full bg-background rounded-full shadow-inner border-[1px] border-foreground/10 flex items-center justify-center relative overflow-hidden">
                    <svg
                        viewBox="0 0 200 200"
                        className="w-full h-full rounded-full"
                    >
                        {/* Clock Face Pattern/Texture */}
                        <circle cx="100" cy="100" r="98" fill="none" className="stroke-foreground/5" strokeWidth="4" />

                        {/* Title text */}
                        <text x="100" y="70" textAnchor="middle" className="fill-foreground/30 font-sans tracking-widest text-[8px] font-bold uppercase mt-2">FOCUS TIME</text>

                        {/* Ticks & Numbers */}
                        {Array.from({ length: 60 }).map((_, i) => {
                            const isHour = i % 5 === 0;
                            const angle = (i * 6 * Math.PI) / 180;

                            const outerRadius = 90;
                            const innerRadius = isHour ? 82 : 86;
                            const x1 = 100 + outerRadius * Math.sin(angle);
                            const y1 = 100 - outerRadius * Math.cos(angle);
                            const x2 = 100 + innerRadius * Math.sin(angle);
                            const y2 = 100 - innerRadius * Math.cos(angle);

                            const textRadius = 66;
                            const tx = 100 + textRadius * Math.sin(angle);
                            const ty = 100 - textRadius * Math.cos(angle);

                            return (
                                <g key={i}>
                                    <line
                                        x1={x1} y1={y1} x2={x2} y2={y2}
                                        className={isHour ? "stroke-foreground/60" : "stroke-foreground/20"}
                                        strokeWidth={isHour ? "2" : "1"}
                                        strokeLinecap="round"
                                    />
                                    {isHour && (
                                        <text
                                            x={tx} y={ty}
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            className="fill-foreground/90 font-sans font-bold text-[14px]"
                                        >
                                            {numerals[i / 5]}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {/* Hour Hand */}
                        <line
                            x1="100" y1="100" x2="100" y2="55"
                            className="stroke-foreground"
                            strokeWidth="4"
                            strokeLinecap="round"
                            style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: "100px 100px", transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                        />

                        {/* Minute Hand */}
                        <line
                            x1="100" y1="100" x2="100" y2="30"
                            className="stroke-foreground"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: "100px 100px", transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                        />

                        {/* Second Hand */}
                        <line
                            x1="100" y1="100" x2="100" y2="25"
                            stroke="#ef4444"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: "100px 100px", transition: "transform 0.2s linear" }}
                        />

                        {/* Counterweight for second hand */}
                        <line
                            x1="100" y1="100" x2="100" y2="115"
                            stroke="#ef4444"
                            strokeWidth="2"
                            strokeLinecap="round"
                            style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: "100px 100px", transition: "transform 0.2s linear" }}
                        />

                        <circle cx="100" cy="100" r="4" className="fill-foreground" />
                        <circle cx="100" cy="100" r="1.5" fill="#ef4444" />

                    </svg>
                </div>
            </div>
        </div>
    );
}
