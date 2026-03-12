import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = "https://vakithane.com.tr";
    const pages = [
        { url: base, priority: 1.0, changeFrequency: "daily" as const },
        { url: `${base}/namaz-vakitleri`, priority: 0.9, changeFrequency: "daily" as const },
        { url: `${base}/sinav-sayaci`, priority: 0.9, changeFrequency: "weekly" as const },
        { url: `${base}/meditasyon`, priority: 0.7, changeFrequency: "monthly" as const },
        { url: `${base}/ozel-gunler`, priority: 0.7, changeFrequency: "weekly" as const },
        { url: `${base}/kronometre`, priority: 0.6, changeFrequency: "monthly" as const },
        { url: `${base}/dunya-saatleri`, priority: 0.6, changeFrequency: "monthly" as const },
    ];
    return pages.map(p => ({
        url: p.url,
        lastModified: new Date(),
        changeFrequency: p.changeFrequency,
        priority: p.priority,
    }));
}
