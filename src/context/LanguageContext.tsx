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
