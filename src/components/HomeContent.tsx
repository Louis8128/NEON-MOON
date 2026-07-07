"use client";

import { useI18n } from "@/components/I18nProvider";

export default function HomeContent() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#0077b6] text-white">
      <section className="relative min-h-screen overflow-hidden bg-[#0077b6] bg-[url('/images/home-ocean-sky.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#023e8a]/10 via-transparent to-[#0077b6]/18" />

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pb-16 pt-32 sm:px-8 lg:px-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-[#caf0f8] drop-shadow-[0_2px_8px_rgba(2,62,138,0.55)]">
            {t.home.eyebrow}
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_18px_rgba(3,4,94,0.55)] sm:text-5xl lg:text-6xl">
            {t.home.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#eaf8ff] drop-shadow-[0_3px_12px_rgba(3,4,94,0.55)] sm:text-lg">
            {t.home.description}
          </p>
        </div>
      </section>
    </main>
  );
}
