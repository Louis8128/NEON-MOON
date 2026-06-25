import Link from "next/link";

const featureCards = [
  {
    title: "Blog",
    href: "/blog",
    description: "Technical notes and life reflections.",
  },
  {
    title: "Media Library",
    href: "/media",
    description: "Music, books, movies, anime, and games I like.",
  },
  {
    title: "Photos",
    href: "/photos",
    description: "Travel and daily-life photography.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0077b6] text-white">
      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-5xl flex-col justify-center px-6 py-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#caf0f8]">
          Personal Full-Stack Website
        </p>

        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Welcome to My Life Site - Neon Moon
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[#eaf8ff]">
          This website will become my personal digital space for blogs, media
          collections, photos, music, books, movies, anime, and games.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {featureCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-5 transition hover:-translate-y-1 hover:border-[#caf0f8]/60 hover:bg-[#caf0f8]/15"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-[#caf0f8]/80">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
