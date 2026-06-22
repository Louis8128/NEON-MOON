import Link from "next/link";
import { MediaCategory } from "@prisma/client";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type MediaPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const categoryTabs = [
  {
    label: "All",
    href: "/media",
    value: undefined,
  },
  {
    label: "Movie",
    href: "/media?category=MOVIE",
    value: MediaCategory.MOVIE,
  },
  {
    label: "Music",
    href: "/media?category=MUSIC",
    value: MediaCategory.MUSIC,
  },
  {
    label: "Book",
    href: "/media?category=BOOK",
    value: MediaCategory.BOOK,
  },
  {
    label: "Anime",
    href: "/media?category=ANIME",
    value: MediaCategory.ANIME,
  },
  {
    label: "Game",
    href: "/media?category=GAME",
    value: MediaCategory.GAME,
  },
];

const validCategories = Object.values(MediaCategory);

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const params = await searchParams;
  const categoryParam = params.category;

  const selectedCategory = validCategories.includes(
    categoryParam as MediaCategory,
  )
    ? (categoryParam as MediaCategory)
    : undefined;

  const mediaItems = await prisma.mediaItem.findMany({
    where: selectedCategory
      ? {
          category: selectedCategory,
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Media Library"
          title="Things I watched, read, played, and listened to"
          description="A personal archive of media I care about, now loaded from the MySQL database through Prisma."
        />

        <section className="mb-10 flex flex-wrap gap-3">
          {categoryTabs.map((tab) => {
            const isActive = tab.value === selectedCategory;

            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={
                  isActive
                    ? "rounded-full border border-cyan-400 bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
                    : "rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </section>

        {mediaItems.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
            <p className="text-lg font-semibold text-slate-200">
              No media items found.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Try another category or add more records to the database.
            </p>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mediaItems.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    {item.category}
                  </span>

                  {item.rating !== null && (
                    <span className="text-sm font-semibold text-amber-300">
                      {item.rating}/10
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white">{item.title}</h2>

                <div className="mt-2 space-y-1 text-sm text-slate-400">
                  {item.creator && <p>Creator: {item.creator}</p>}
                  {item.releaseYear && <p>Year: {item.releaseYear}</p>}
                </div>

                {item.note && (
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {item.note}
                  </p>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
