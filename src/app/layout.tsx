import type { Metadata } from "next";
import { StatsWidget } from "@/components/StatsWidget";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vakithane.com.tr"),
  title: {
    default: "VakitHane – Online Zamanlayıcı, Sınav Sayacı & Namaz Vakitleri",
    template: "%s | VakitHane",
  },
  description:
    "Ücretsiz online zamanlayıcı ve geri sayım sayacı. YKS, TYT, AYT sınav geri sayımı, namaz vakitleri, iftar sayacı, Ramazan takvimi ve meditasyon sayacı tek platformda.",
  keywords: [
    "online zamanlayıcı",
    "online timer",
    "geri sayım sayacı",
    "sınav geri sayım",
    "yks geri sayım",
    "tyt geri sayım",
    "ayt geri sayım",
    "ders çalışma sayacı",
    "pomodoro sayacı",
    "namaz vakitleri",
    "ezan vakitleri",
    "iftar sayacı",
    "ramazan takvimi",
    "sahur vakti",
    "meditasyon sayacı",
    "nefes egzersizi",
    "odaklanma sayacı",
    "timer online",
    "countdown timer",
    "focus timer",
  ],
  authors: [{ name: "VakitHane" }],
  creator: "VakitHane",
  publisher: "VakitHane",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title: "VakitHane – Online Zamanlayıcı, Sınav Sayacı & Namaz Vakitleri",
    description:
      "Ücretsiz online zamanlayıcı. YKS sınav geri sayımı, namaz vakitleri, iftar sayacı ve meditasyon aynı adreste.",
    type: "website",
    locale: "tr_TR",
    siteName: "VakitHane",
    url: "https://vakithane.com.tr",
  },
  twitter: {
    card: "summary_large_image",
    title: "VakitHane – Online Zamanlayıcı & Sınav Sayacı",
    description: "YKS sayım, namaz vakitleri, iftar ve meditasyon sayacı — hepsi ücretsiz.",
    creator: "@vakithane",
  },
  alternates: {
    canonical: "https://vakithane.com.tr",
    languages: { "tr-TR": "https://vakithane.com.tr" },
  },
  verification: {
    google: "google-site-verification-token",
  },
  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://vakithane.com.tr" />
        <meta name="theme-color" content="#f9f7f4" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0d0e14" media="(prefers-color-scheme: dark)" />
        <meta name="application-name" content="VakitHane" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VakitHane" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "VakitHane",
              url: "https://vakithane.com.tr",
              description: "Online zamanlayıcı, sınav geri sayım, namaz vakitleri ve meditasyon sayacı.",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
              inLanguage: "tr-TR",
              keywords: "online timer, sınav sayacı, namaz vakitleri, pomodoro, meditasyon",
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden min-h-screen">
        <StatsWidget />
        {children}
      </body>
    </html>
  );
}
