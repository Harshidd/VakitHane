import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sınav Geri Sayım – YKS, LGS, KPSS | VakitHane",
    description: "YKS 2026, LGS 2026, KPSS ve ALES sınav geri sayım sayacı. Hedefe kaç gün, saat ve dakika kaldığını anında görün.",
    keywords: ["yks geri sayım", "lgs geri sayım", "kpss sayacı", "sınav sayacı 2026", "tyt geri sayım", "ayt geri sayım"],
    openGraph: {
        title: "Sınav Geri Sayım – YKS, LGS, KPSS | VakitHane",
        description: "YKS, LGS, KPSS sınav tarihlerine kaç gün kaldı? Gerçek zamanlı geri sayım ile takip et.",
        url: "https://vakithane.com.tr/sinav-sayaci",
    },
    alternates: { canonical: "https://vakithane.com.tr/sinav-sayaci" },
};

export default function SinavLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
