"use client";

import Link from "next/link";
import { Timer } from "lucide-react";
import { motion } from "framer-motion";

export function HomeButton() {
    return (
        <Link href="/" className="group flex items-center gap-2 cursor-pointer z-50">
            <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-foreground/5 dark:bg-foreground/10 backdrop-blur-md border border-foreground/10 p-2 rounded-xl group-hover:bg-foreground group-hover:text-background transition-all shadow-md"
            >
                <Timer size={16} strokeWidth={2.5} />
            </motion.div>
            <span className="font-bold text-[14px] tracking-tight opacity-60 group-hover:opacity-100 transition-opacity hidden xs:block">VakitHane</span>
        </Link>
    );
}
