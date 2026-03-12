import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Namaz Vakitleri & Dini Günler | VakitHane",
    description: "Türkiye'deki tüm şehirler için namaz vakitleri. İmsak, sabah, öğle, ikindi, akşam, yatsı saatleri. Ramazan bayramı ve dini günler geri sayımı.",
    keywords: ["namaz vakitleri", "ezan vakitleri", "imsak vakti", "sahur vakti", "iftar vakti", "ramazan 2026", "kurban bayramı 2026"],
    openGraph: {
        title: "Namaz Vakitleri – Güncel Diyanet Verileri | VakitHane",
        description: "Türkiye'deki şehirlerin güncel namaz vakitleri, Ramazan takvimi ve dini günler geri sayımı.",
        url: "https://vakithane.com.tr/namaz-vakitleri",
    },
    alternates: { canonical: "https://vakithane.com.tr/namaz-vakitleri" },
};

export default function NamazLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
