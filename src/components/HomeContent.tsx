"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

const featureCards = [
  {
    key: "blog",
    href: "/blog",
  },
  {
    key: "media",
    href: "/media",
  },
  {
    key: "photos",
    href: "/photos",
  },
] as const;

export default function HomeContent() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#0077b6] text-white">
      <section className="relative min-h-screen overflow-hidden bg-[#0077b6] bg-[url('/images/home-ocean-sky.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#023e8a]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#023e8a]/35 via-[#0077b6]/20 to-[#0077b6]/70" />

        <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pb-20 pt-32">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#caf0f8]">
            {t.home.eyebrow}
          </p>

          <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tight drop-shadow-lg">
            {t.home.title}
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-[#eaf8ff] drop-shadow">
            {t.home.description}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {featureCards.map((card) => {
              const cardText = t.home.cards[card.key];

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/75 p-5 shadow-xl shadow-[#023e8a]/20 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#caf0f8]/70 hover:bg-[#023e8a]/85"
                >
                  <h2 className="text-xl font-semibold">{cardText.title}</h2>
                  <p className="mt-2 text-sm text-[#caf0f8]/85">
                    {cardText.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
