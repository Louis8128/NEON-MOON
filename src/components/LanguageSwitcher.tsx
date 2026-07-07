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
      className="inline-flex h-10 w-full min-w-[132px] rounded-full border border-[#caf0f8]/30 bg-[#023e8a]/45 p-1 sm:w-auto"
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
                ? "flex h-8 min-w-[58px] items-center justify-center rounded-full bg-[#caf0f8] px-3 text-xs font-semibold text-[#023e8a] transition whitespace-nowrap"
                : "flex h-8 min-w-[58px] items-center justify-center rounded-full px-3 text-xs font-semibold text-[#caf0f8] transition hover:bg-[#caf0f8]/15 hover:text-white whitespace-nowrap"
            }
          >
            {getLocaleLabel(targetLocale)}
          </button>
        );
      })}
    </div>
  );
}
