import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nefes Egzersizi & Meditasyon Sayacı | VakitHane",
    description: "4-7-8 nefes tekniği, kare nefes egzersizi ve meditasyon sayacı. Stres azaltma ve odaklanma için rehberli nefes programları.",
    keywords: ["nefes egzersizi", "meditasyon sayacı", "4-7-8 nefes", "kare nefes", "stres azaltma", "mindfulness", "nefes tekniği"],
    openGraph: {
        title: "Nefes Egzersizi & Meditasyon | VakitHane",
        description: "4-7-8 ve kare nefes teknikleri ile stres atın. Rehberli meditasyon sayacı.",
        url: "https://vakithane.com.tr/meditasyon",
    },
    alternates: { canonical: "https://vakithane.com.tr/meditasyon" },
};

export default function MeditasyonLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
