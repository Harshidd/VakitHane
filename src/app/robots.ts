import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/_next/"],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
            },
        ],
        sitemap: "https://vakithane.com.tr/sitemap.xml",
        host: "https://vakithane.com.tr",
    };
}
