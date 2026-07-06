"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

const mediaCategories = ["MOVIE", "MUSIC", "BOOK", "ANIME", "GAME"] as const;

export type MediaCategory = (typeof mediaCategories)[number];
export type MediaFilter = "ALL" | MediaCategory;

export type MediaListItem = {
  id: number;
  title: string;
  category: MediaCategory;
  creator: string | null;
  releaseYear: number | null;
  coverUrl: string | null;
  rating: number | null;
  note: string | null;
};

function getCategoryHref(category: MediaFilter) {
  if (category === "ALL") {
    return "/media";
  }

  return `/media?category=${category}`;
}

function getCategoryLabel(
  category: MediaFilter,
  labels: ReturnType<typeof useI18n>["t"]["media"]["categories"],
) {
  const categoryKey = category.toLowerCase() as keyof typeof labels;
  return labels[categoryKey];
}

export default function MediaListContent({
  activeFilter,
  mediaItems,
}: {
  activeFilter: MediaFilter;
  mediaItems: MediaListItem[];
}) {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <section className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            {t.media.mediaCollection}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            {t.media.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {t.media.description}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {(["ALL", ...mediaCategories] as MediaFilter[]).map((filter) => (
            <Link
              key={filter}
              href={getCategoryHref(filter)}
              className={
                activeFilter === filter
                  ? "rounded-full bg-[#caf0f8] px-4 py-2 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
                  : "rounded-full border border-[#caf0f8]/50 px-4 py-2 text-sm font-semibold text-[#caf0f8] transition hover:bg-[#caf0f8] hover:text-[#023e8a]"
              }
            >
              {getCategoryLabel(filter, t.media.categories)}
            </Link>
          ))}
        </div>

        {mediaItems.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              {t.media.noMediaItemsYet}
            </p>

            <p className="mt-2 text-sm text-[#caf0f8]/80">
              {t.media.noMediaDescription}
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mediaItems.map((item) => (
              <Link
                key={item.id}
                href={`/media/${item.id}`}
                className="group overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 shadow-lg shadow-[#03045e]/20 backdrop-blur transition hover:-translate-y-1 hover:border-[#caf0f8]/50 hover:bg-[#03045e]/65"
              >
                {item.coverUrl ? (
                  <div
                    className="h-56 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                    style={{
                      backgroundImage: `url(${item.coverUrl})`,
                    }}
                    aria-label={`${item.title} cover image`}
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-[#03045e]/65 px-6 text-center">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#caf0f8]">
                        {getCategoryLabel(item.category, t.media.categories)}
                      </p>

                      <p className="mt-3 text-xl font-bold text-white">
                        {item.title}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#caf0f8]/40 bg-[#caf0f8]/10 px-3 py-1 text-xs font-semibold text-[#caf0f8]">
                      {getCategoryLabel(item.category, t.media.categories)}
                    </span>

                    {item.rating !== null && (
                      <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                        {item.rating}/10
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-white transition group-hover:text-[#caf0f8]">
                    {item.title}
                  </h2>

                  <div className="mt-3 space-y-1 text-sm text-[#caf0f8]/80">
                    <p>{item.creator ?? t.media.unknownCreator}</p>

                    {item.releaseYear && (
                      <p>
                        {t.media.releasedIn} {item.releaseYear}
                      </p>
                    )}
                  </div>

                  {item.note && (
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#caf0f8]/80">
                      {item.note}
                    </p>
                  )}

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#caf0f8] opacity-80 transition group-hover:opacity-100">
                    {t.media.viewDetails} →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
