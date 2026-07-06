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
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-5xl flex-col justify-center px-6 py-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#caf0f8]">
          {t.home.eyebrow}
        </p>

        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          {t.home.title}
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[#eaf8ff]">
          {t.home.description}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {featureCards.map((card) => {
            const cardText = t.home.cards[card.key];

            return (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-2xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-5 transition hover:-translate-y-1 hover:border-[#caf0f8]/60 hover:bg-[#caf0f8]/15"
              >
                <h2 className="text-xl font-semibold">{cardText.title}</h2>
                <p className="mt-2 text-sm text-[#caf0f8]/80">
                  {cardText.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
