"use client";

import { useEffect, useRef } from "react";

interface RippleBackgroundProps {
    withStars?: boolean;
}

interface Ripple {
    x: number; y: number; r: number; maxR: number; alpha: number; speed: number;
}

interface Star {
    x: number; y: number; r: number; alpha: number; dy: number; twinkle: number;
}

export function RippleBackground({ withStars = false }: RippleBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        const ripples: Ripple[] = [];
        const stars: Star[] = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            if (withStars && stars.length === 0) seedStars();
        };

        const seedStars = () => {
            for (let i = 0; i < 120; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: 0.4 + Math.random() * 1.6,
                    alpha: 0.1 + Math.random() * 0.6,
                    dy: -0.08 - Math.random() * 0.12,
                    twinkle: Math.random() * Math.PI * 2,
                });
            }
        };

        resize();
        window.addEventListener("resize", resize);

        const spawnRipple = () => {
            const w = canvas.width;
            const h = canvas.height;
            const side = Math.random() < 0.5 ? "left" : "right";
            const x = side === "left"
                ? Math.random() * w * 0.28
                : w * 0.72 + Math.random() * w * 0.28;
            const y = Math.random() * h;
            const maxR = 60 + Math.random() * 140;
            ripples.push({ x, y, r: 0, maxR, alpha: 0.55, speed: 0.55 + Math.random() * 0.6 });
        };

        const spawnInterval = setInterval(spawnRipple, 1800);
        spawnRipple(); spawnRipple(); spawnRipple();

        let tick = 0;
        const draw = () => {
            tick++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Stars
            if (withStars) {
                for (const s of stars) {
                    s.twinkle += 0.02;
                    s.y += s.dy;
                    if (s.y < -5) s.y = canvas.height + 5;
                    const a = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(210, 220, 255, ${a})`;
                    ctx.fill();
                }
            }

            // Ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                const rp = ripples[i];
                rp.r += rp.speed;
                rp.alpha -= 0.0038;
                if (rp.alpha <= 0 || rp.r > rp.maxR) { ripples.splice(i, 1); continue; }

                ctx.beginPath();
                ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
                ctx.strokeStyle = withStars
                    ? `rgba(160, 180, 255, ${rp.alpha * 0.8})`
                    : `rgba(180, 160, 255, ${rp.alpha * 0.9})`;
                ctx.lineWidth = 1.2;
                ctx.stroke();

                if (rp.r > 20) {
                    ctx.beginPath();
                    ctx.arc(rp.x, rp.y, rp.r * 0.55, 0, Math.PI * 2);
                    ctx.strokeStyle = withStars
                        ? `rgba(120, 160, 255, ${rp.alpha * 0.45})`
                        : `rgba(130, 180, 255, ${rp.alpha * 0.5})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animId);
            clearInterval(spawnInterval);
            window.removeEventListener("resize", resize);
        };
    }, [withStars]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70 dark:opacity-55"
        />
    );
}
