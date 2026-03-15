"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, BookOpen, Moon, Calendar, Wind } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const getTabs = (t: (s: string) => string) => [
    { label: t("tab_timer"), icon: Clock, href: "/" },
    { label: t("tab_exams"), icon: BookOpen, href: "/sinav-sayaci" },
    { label: t("tab_prayers"), icon: Moon, href: "/namaz-vakitleri" },
    { label: t("tab_events"), icon: Calendar, href: "/ozel-gunler" },
    { label: t("tab_meditation"), icon: Wind, href: "/meditasyon" },
];

/** inline=true → header'ın içine gömülü hali */
export function TabBar({ inline = false }: { inline?: boolean }) {
    const pathname = usePathname();
    const { t } = useLanguage();
    const tabs = getTabs(t);

    const inner = (
        <div className="glass shadow-md shadow-black/5 dark:shadow-white/5 p-1.5 rounded-2xl flex gap-0.5 bg-white/60 dark:bg-black/40 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`group relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] sm:min-w-[72px] ${isActive ? "text-background" : "text-foreground/55 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"}`}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="active-tab"
                                className="absolute inset-0 bg-foreground rounded-xl z-0"
                                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                        )}
                        <span className="relative z-10 flex flex-col items-center gap-1">
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            <span className={`text-[10px] font-semibold tracking-tight leading-none transition-all ${isActive ? "opacity-100" : "opacity-60 hidden sm:block group-hover:opacity-100"}`}>
                                {tab.label}
                            </span>
                        </span>
                    </Link>
                );
            })}
        </div>
    );

    if (inline) {
        return <nav className="flex items-center justify-center">{inner}</nav>;
    }

    // Fixed/floating fallback (used from nested pages)
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
            {inner}
        </motion.div>
    );
}
