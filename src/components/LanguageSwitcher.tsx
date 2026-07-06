"use client";

import { type Locale } from "@/lib/i18n";
import { useI18n } from "@/components/I18nProvider";

const localeOptions: Locale[] = ["en", "zh"];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  function getLocaleLabel(targetLocale: Locale) {
    return targetLocale === "en" ? t.language.english : t.language.chinese;
  }

  return (
    <div
      aria-label={t.language.label}
      className="inline-flex rounded-full border border-[#caf0f8]/30 bg-[#023e8a]/45 p-1"
    >
      {localeOptions.map((targetLocale) => {
        const isActive = locale === targetLocale;

        return (
          <button
            key={targetLocale}
            type="button"
            aria-pressed={isActive}
            onClick={() => setLocale(targetLocale)}
            className={
              isActive
                ? "rounded-full bg-[#caf0f8] px-3 py-1.5 text-xs font-semibold text-[#023e8a] transition"
                : "rounded-full px-3 py-1.5 text-xs font-semibold text-[#caf0f8] transition hover:bg-[#caf0f8]/15 hover:text-white"
            }
          >
            {getLocaleLabel(targetLocale)}
          </button>
        );
      })}
    </div>
  );
}
