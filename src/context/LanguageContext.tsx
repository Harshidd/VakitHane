"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "tr" | "en";

interface Translations {
  [key: string]: {
    tr: string;
    en: string;
  };
}

const translations: Translations = {
  // Common
  "design_by": { tr: "tasarım", en: "design by" },
  "back": { tr: "Geri", en: "Back" },
  "today": { tr: "Bugün", en: "Today" },
  "tomorrow": { tr: "Yarın", en: "Tomorrow" },
  "yesterday": { tr: "Dün", en: "Yesterday" },
  "loading": { tr: "Yükleniyor...", en: "Loading..." },
  "error_loading": { tr: "⚠️ Vakitler yüklenemedi. İnternet bağlantınızı kontrol edin.", en: "⚠️ Failed to load times. Check your internet connection." },

  // Home Page
  "school_exams": { tr: "Okul & Sınavlar", en: "School & Exams" },
  "exam_countdowns": { tr: "Sınav Geri Sayımları", en: "Exam Countdowns" },
  "faith_worship": { tr: "İnanç & İbadet", en: "Faith & Worship" },
  "namaz_iftar": { tr: "Namaz & İftar", en: "Prayer & Iftar" },
  "stopwatch": { tr: "Kronometre", en: "Stopwatch" },
  "time_measurement": { tr: "Süre Ölçümü", en: "Time Measurement" },
  "relaxation": { tr: "Rahatlama", en: "Relaxation" },
  "breath_meditation": { tr: "Nefes & Meditasyon", en: "Breath & Meditation" },
  "special_days": { tr: "Özel Günler", en: "Special Days" },
  "event_countdowns": { tr: "Etkinlik Sayaçları", en: "Event Countdowns" },
  "world_clocks": { tr: "Dünya Saatleri", en: "World Clocks" },
  "cities_timezones": { tr: "Şehirler & Saat Dilimleri", en: "Cities & Time Zones" },
  "focus_process": { tr: "Odaklanma Süreci", en: "Focus Process" },
  "stop": { tr: "Durdur", en: "Stop" },
  "pause": { tr: "Duraklat", en: "Pause" },
  "paused": { tr: "Duraklatıldı", en: "Paused" },
  "resume": { tr: "Devam", en: "Resume" },
  "reset": { tr: "Sıfırla", en: "Reset" },
  "start": { tr: "Başlat", en: "Start" },
  "custom_duration": { tr: "Özel Süre", en: "Custom duration" },

  // Prayer Times
  "prayer_times": { tr: "Namaz Vakitleri", en: "Prayer Times" },
  "religious_days": { tr: "Dini Günler", en: "Religious Days" },
  "next_prayer": { tr: "Bir Sonraki Vakit", en: "Next Prayer" },
  "imsak": { tr: "İmsak", en: "Imsak" },
  "fajr": { tr: "Sabah", en: "Fajr" },
  "sunrise": { tr: "Güneş", en: "Sunrise" },
  "dhuhr": { tr: "Öğle", en: "Dhuhr" },
  "asr": { tr: "İkindi", en: "Asr" },
  "maghrib": { tr: "Akşam", en: "Maghrib" },
  "isha": { tr: "Yatsı", en: "Isha" },
  "ramadan": { tr: "Ramazan", en: "Ramadan" },
  "iftar": { tr: "İftar", en: "Iftar" },
  "sahur": { tr: "Sahur", en: "Sahur" },
  "all": { tr: "Tümü", en: "All" },
  "holidays": { tr: "Bayramlar", en: "Holidays" },
  "kandils": { tr: "Kandiller", en: "Kandils" },
  "others": { tr: "Diğer", en: "Others" },
  "passed": { tr: "Geçti", en: "Passed" },
  "days_left": { tr: "gün", en: "days" },
  "source": { tr: "Kaynak", en: "Source" },
  "method": { tr: "yöntemi", en: "method" },

  // Exam Counter
  "exam_timer": { tr: "Sınav Sayacı", en: "Exam Timer" },
  "remaining": { tr: "Kaldı", en: "Remaining" },
  "year": { tr: "Yıl", en: "Year" },
  "month": { tr: "Ay", en: "Month" },
  "day": { tr: "Gün", en: "Day" },
  "hour": { tr: "Saat", en: "Hour" },
  "minute": { tr: "Dakika", en: "Minute" },
  "second": { tr: "Saniye", en: "Second" },

  // World Clocks
  "local_time": { tr: "Yerel Saat", en: "Local Time" },
  "search_city": { tr: "Şehir ara...", en: "Search city..." },

  // Meditation
  "breathe_in": { tr: "Nefes Al", en: "Breathe In" },
  "hold": { tr: "Tut", en: "Hold" },
  "breathe_out": { tr: "Nefes Ver", en: "Breathe Out" },

  // TabBar
  "tab_timer": { tr: "Zamanlayıcı", en: "Timer" },
  "tab_exams": { tr: "Sınavlar", en: "Exams" },
  "tab_prayers": { tr: "Vakitler", en: "Prayers" },
  "tab_events": { tr: "Etkinlikler", en: "Events" },
  "tab_meditation": { tr: "Meditasyon", en: "Meditation" },
  "tab_stopwatch": { tr: "Kronometre", en: "Stopwatch" },
  "tab_world_clocks": { tr: "Dünya Saatleri", en: "World Clocks" },

  // Exams
  "target_time_left": { tr: "Hedefe Kalan Süre", en: "Time Remaining to Target" },
  "elapsed_time": { tr: "Geçen Süre", en: "Elapsed Time" },

  // Meditation
  "meditation_title": { tr: "Nefes Egzersizi", en: "Breathing Exercise" },
  "meditation_desc": { tr: "Zihninizi sakinleştirin ve nefesinize odaklanın.", en: "Calm your mind and focus on your breath." },
  "box_breathing": { tr: "Kare Nefes", en: "Box Breathing" },
  "deep_breathing": { tr: "Derin Nefes", en: "Deep Breathing" },
  "wait": { tr: "Bekle", en: "Wait" },
  "cycle": { tr: "Döngü", en: "Cycle" },
  "duration": { tr: "Süre", en: "Duration" },
  "rain": { tr: "Yağmur", en: "Rain" },
  "fire": { tr: "Şömine", en: "Fire" },
  "wind": { tr: "Rüzgar", en: "Wind" },
  "space_sound": { tr: "Uzay", en: "Space" },
  "click": { tr: "Tıkla", en: "Click" },

  // Special Days
  "my_special_days": { tr: "Özel Günlerim", en: "My Special Days" },
  "add": { tr: "Ekle", en: "Add" },
  "new_event": { tr: "Yeni Etkinlik", en: "New Event" },
  "event_name_placeholder": { tr: "Etkinlik adı...", en: "Event name..." },
  "cancel": { tr: "Vazgeç", en: "Cancel" },
  "save": { tr: "Kaydet", en: "Save" },
  "expired": { tr: "Süresi doldu", en: "Expired" },
  "approaching": { tr: "Yaklaşıyor", en: "Approaching" },
  "no_events_yet": { tr: "Henüz etkinlik yok.", en: "No events yet." },
  "add_from_top": { tr: "Sağ üstten ekleyebilirsiniz.", en: "You can add from top right." },

  // Stopwatch
  "lap": { tr: "Tur", en: "Lap" },
  "lap_time": { tr: "Tur Süresi", en: "Lap Time" },
  "total": { tr: "Toplam", en: "Total" },

  // World Clocks
  "drag_rotate": { tr: "sürükle · döndür", en: "drag · rotate" },
  "city_times": { tr: "Şehir Saatleri", en: "City Times" },
  "Istanbul": { tr: "İstanbul", en: "Istanbul" },
  "Ankara": { tr: "Ankara", en: "Ankara" },
  "London": { tr: "Londra", en: "London" },
  "Paris": { tr: "Paris", en: "Paris" },
  "Berlin": { tr: "Berlin", en: "Berlin" },
  "Moscow": { tr: "Moskova", en: "Moscow" },
  "Dubai": { tr: "Dubai", en: "Dubai" },
  "Mumbai": { tr: "Mumbai", en: "Mumbai" },
  "Singapore": { tr: "Singapur", en: "Singapore" },
  "Tokyo": { tr: "Tokyo", en: "Tokyo" },
  "Shanghai": { tr: "Şangay", en: "Shanghai" },
  "Sydney": { tr: "Sidney", en: "Sydney" },
  "New York": { tr: "New York", en: "New York" },
  "Los Angeles": { tr: "Los Angeles", en: "Los Angeles" },
  "Sao Paulo": { tr: "São Paulo", en: "Sao Paulo" },

  // --- SEO CONTENT ---
  // Home
  "seo_home_t1": { tr: "VakitHane: Online Zamanlayıcı ve Pomodoro Sayacı", en: "VakitHane: Online Timer and Pomodoro Counter" },
  "seo_home_p1": { 
    tr: "VakitHane, LGS, YKS, TYT, AYT gibi büyük sınavlara hazırlanan öğrenciler ve Pomodoro tekniği ile çalışma verimini artırmak isteyen herkes için tasarlanmış ücretsiz bir online zamanlayıcıdır.",
    en: "VakitHane is a free online timer designed for students preparing for major exams and anyone looking to increase study productivity with the Pomodoro technique."
  },
  "seo_home_t2": { tr: "Sınava Özel Süreler ve Minimalist Tasarım", en: "Exam-Specific Durations and Minimalist Design" },
  "seo_home_p2": {
    tr: "Sözel 75 dk, Sayısal 80 dk, TYT 165 dk ve AYT 180 dk gibi hazır süre butonlarımızı kullanarak gerçek sınav deneyimine uygun zaman tutabilirsiniz.",
    en: "You can keep time suitable for the real exam experience by using our ready-made duration buttons such as Verbal 75 min, Numerical 80 min, TYT 165 min and AYT 180 min."
  },

  // Prayer
  "seo_prayer_t1": { tr: "İl İl Ezan Vakitleri ve Dini Günler Takvimi", en: "Provincial Prayer Times and Religious Days Calendar" },
  "seo_prayer_p1": {
    tr: "İstanbul, Ankara, İzmir ve tüm Türkiye illeri için Diyanet İşleri Başkanlığı verileriyle uyumlu imsak, güneş, öğle, ikindi, akşam ve yatsı vakitlerini anlık olarak takip edin.",
    en: "Follow imsak, sunrise, dhuhr, asr, maghrib and isha times for Istanbul, Ankara, Izmir and all Turkish provinces in real time, compatible with Presidency of Religious Affairs data."
  },
  "seo_prayer_t2": { tr: "İftar Sayacı ve Hicri Tarih Bilgisi", en: "Iftar Counter and Hijri Date Information" },
  "seo_prayer_p2": {
    tr: "Modern ve sade arayüzümüz üzerinden sadece bugünkü vakitleri değil, yaklaşan dini gün ve gecelere ne kadar süre kaldığını da görebilirsiniz.",
    en: "Through our modern and simple interface, you can see not only today's times, but also how much time is left until upcoming religious days and nights."
  },

  // Exam
  "seo_exam_t1": { tr: "YKS, LGS ve KPSS'ye Kaç Gün Kaldı?", en: "How Many Days Left for YKS, LGS and KPSS?" },
  "seo_exam_p1": {
    tr: "VakitHane sınav geri sayım sayacı sayesinde YKS 2026, LGS, KPSS ve ALES gibi Türkiye'nin en büyük sınavlarına saniyesi saniyesine ne kadar süre kaldığını takip edebilirsiniz.",
    en: "Thanks to the VakitHane exam countdown timer, you can follow exactly how much time is left for Turkey's biggest exams such as YKS 2026, LGS, KPSS and ALES."
  },
  "seo_exam_t2": { tr: "Motivasyonunuzu Yüksek Tutun", en: "Keep Your Motivation High" },
  "seo_exam_p2": {
    tr: "Sayfada yer alan motivasyon alıntıları ve sınavınıza kalan sürenin grafiksel gösterimi, stresinizi azaltırken çalışmalara daha iyi odaklanmanızı sağlar.",
    en: "Motivation quotes on the page and the graphical representation of the time remaining for your exam help you focus better on your studies while reducing stress."
  },

  // Meditation
  "seo_med_t1": { tr: "Doğa Sesleri Eşliğinde Nefes ve Meditasyon Egzersizleri", en: "Breathing and Meditation Exercises Accompanied by Nature Sounds" },
  "seo_med_p1": {
    tr: "Yoğun bir günün ardından rahatlamak için doğru teknikle nefes almak hayati önem taşır. Bilimsel olarak kanıtlanmış tekniklerle zihninizi sakinleştirin.",
    en: "Breathing with the right technique is vital to relax after a busy day. Calm your mind with scientifically proven techniques."
  },
  "seo_med_t2": { tr: "Görsel Yönlendirme ve Farkındalık (Mindfulness)", en: "Visual Guidance and Mindfulness" },
  "seo_med_p2": {
    tr: "Genişleyen çember animasyonumuz ile zihninizi boşaltın. Yağmur, Şömine, Rüzgar ortam sesleriyle zen haline ulaşabilirsiniz.",
    en: "Empty your mind with our expanding circle animation. You can reach the zen state with ambient sounds such as Rain, Fireplace, Wind."
  },

  // Special Days
  "seo_special_t1": { tr: "Özel Günlerim ve Etkinlik Sayacı", en: "My Special Days and Event Counter" },
  "seo_special_p1": {
    tr: "Doğum günleri, yılbaşı, tatil planları veya kritik projelerin bitiş tarihlerini VakitHane Özel Günler sekmesine kolayca ekleyebilirsiniz.",
    en: "You can easily add birthdays, New Year's, holiday plans or critical project deadlines to the VakitHane Special Days tab."
  },
  "seo_special_t2": { tr: "Kişisel Geri Sayım Uygulaması", en: "Personal Countdown Application" },
  "seo_special_p2": {
    tr: "Cihazınızda yerel olarak güvenle saklanan bu tarihler, herhangi bir üyelik gerektirmeden reklamsız bir kişisel deneyim sunar.",
    en: "These dates, safely stored locally on your device, offer an ad-free personal experience without requiring any membership."
  },

  // Stopwatch
  "seo_stop_t1": { tr: "Online Hassas Kronometre ve Tur Sayacı", en: "Online Precision Stopwatch and Lap Counter" },
  "seo_stop_p1": {
    tr: "Spor yaparken veya çalışma sürelerinizi analiz ederken ihtiyacınız olan hassasiyeti VakitHane Online Kronometre ile yakalayın.",
    en: "Capture the precision you need while exercising or analyzing your study times with VakitHane Online Stopwatch."
  },
  "seo_stop_t2": { tr: "Verimlilik ve Süre Analizi", en: "Efficiency and Duration Analysis" },
  "seo_stop_p2": {
    tr: "Minimalist tasarımı ve kullanım kolaylığı ile en iyi ve en kötü tur sürelerinizi otomatik olarak işaretleyen kronometremizle performansınızı takip edin.",
    en: "Track your performance with our stopwatch that automatically marks your best and worst lap times with its minimalist design and ease of use."
  },

  // World Clocks
  "seo_world_t1": { tr: "Dünya Saatleri ve Küresel Zaman Dilimleri", en: "World Clocks and Global Time Zones" },
  "seo_world_p1": {
    tr: "Londra'dan Tokyo'ya dünyanın dört bir yanındaki önemli şehirlerin güncel saatlerini 3D dünya modeli eşliğinde sunar.",
    en: "It presents the current times of important cities around the world from London to Tokyo, accompanied by a 3D world model."
  },
  "seo_world_t2": { tr: "Anlık Saat Farkı ve Gece/Gündüz Takibi", en: "Instant Time Difference and Day/Night Tracking" },
  "seo_world_p2": {
    tr: "İnteraktif 3D küremiz ve şehir listemiz sayesinde hangi şehrin şu an geceyi yaşadığını kolayca anlayabilirsiniz.",
    en: "Thanks to our interactive 3D globe and city list, you can easily see which city is currently experiencing night."
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "tr" || saved === "en")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
