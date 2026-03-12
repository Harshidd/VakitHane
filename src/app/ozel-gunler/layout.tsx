import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Özel Günler Geri Sayım | VakitHane",
    description: "Doğum günü, yıldönümü, tatil veya özel etkinliklerinize kaç gün kaldığını takip edin. Kişisel geri sayım takvimi.",
    keywords: ["özel günler sayacı", "doğum günü sayacı", "geri sayım takvimi", "etkinlik sayacı", "tatil geri sayım"],
    openGraph: {
        title: "Özel Günler Geri Sayım | VakitHane",
        description: "Özel etkinliklerinize kaç gün kaldığını takip edin.",
        url: "https://vakithane.com.tr/ozel-gunler",
    },
    alternates: { canonical: "https://vakithane.com.tr/ozel-gunler" },
};

export default function OzelGunlerLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
