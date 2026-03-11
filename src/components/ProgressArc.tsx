"use client";

interface ProgressArcProps {
    /** 0–1: fraction remaining (1 = full, 0 = empty) */
    progress: number;
    size?: number;
}

export function ProgressArc({ progress, size = 260 }: ProgressArcProps) {
    const r = (size - 12) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    // Start at top (−90°), arc clockwise
    const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));

    // Color: green → amber → red as time runs out
    let color = "#22c55e"; // green
    if (progress < 0.5) color = "#f59e0b"; // amber
    if (progress < 0.2) color = "#ef4444"; // red

    return (
        <svg
            width={size}
            height={size}
            className="absolute inset-0 pointer-events-none"
            style={{ top: 0, left: 0 }}
        >
            {/* Track */}
            <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                strokeWidth={5}
                stroke="currentColor"
                className="text-foreground/8"
            />
            {/* Progress arc */}
            <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                strokeWidth={5}
                stroke={color}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.8s ease" }}
            />
        </svg>
    );
}
