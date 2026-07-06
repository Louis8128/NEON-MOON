"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getTranslation,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n";

const LOCALE_CHANGE_EVENT = "neonMoonLocaleChange";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: ReturnType<typeof getTranslation>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getDocumentLang(locale: Locale) {
  return locale === "zh" ? "zh-CN" : "en";
}

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return getDefaultLocale();
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  return isLocale(storedLocale) ? storedLocale : "en";
}

function getDefaultLocale(): Locale {
  return "en";
}

function subscribeToLocaleChanges(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCALE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCALE_CHANGE_EVENT, callback);
  };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocaleChanges,
    readStoredLocale,
    getDefaultLocale,
  );

  useEffect(() => {
    document.documentElement.lang = getDocumentLang(locale);
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    document.documentElement.lang = getDocumentLang(nextLocale);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: getTranslation(locale),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider.");
  }

  return context;
}
