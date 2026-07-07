"use client";

import { useI18n } from "@/components/I18nProvider";

export default function HomeContent() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#0077b6] text-white">
      <section className="relative min-h-screen overflow-hidden bg-[#0077b6] bg-[url('/images/home-ocean-sky.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#023e8a]/10 via-transparent to-[#0077b6]/35" />

        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-28 text-center sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.32em] text-[#caf0f8] drop-shadow-[0_2px_8px_rgba(2,62,138,0.6)]">
              {t.home.eyebrow}
            </p>

            <p className="text-3xl font-semibold leading-relaxed tracking-wide text-[#f8fcff] drop-shadow-[0_5px_22px_rgba(3,4,94,0.72)] sm:text-4xl md:text-5xl">
              {t.home.poemLine}
            </p>

            <p className="mt-5 text-base font-medium text-[#eaf8ff] drop-shadow-[0_3px_14px_rgba(3,4,94,0.68)] sm:text-lg">
              {t.home.poemSource}
            </p>

            {t.home.poemTranslation && (
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#caf0f8] drop-shadow-[0_3px_12px_rgba(3,4,94,0.68)] sm:text-base">
                {t.home.poemTranslation}
              </p>
            )}
          </div>
        </div>

        <a
          href="#home-intro"
          aria-label={t.home.scrollLabel}
          title={t.home.scrollLabel}
          className="absolute bottom-8 left-1/2 inline-flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/45 bg-[#023e8a]/25 text-xl text-white shadow-lg shadow-[#03045e]/25 backdrop-blur-md transition hover:border-[#caf0f8] hover:bg-[#caf0f8]/20"
        >
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section
        id="home-intro"
        className="flex min-h-[70vh] items-center bg-[#0077b6] px-6 py-24 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#caf0f8]">
            {t.home.eyebrow}
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t.home.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#eaf8ff] sm:text-lg">
            {t.home.description}
          </p>
        </div>
      </section>
    </main>
  );
}
