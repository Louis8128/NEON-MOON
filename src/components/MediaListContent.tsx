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

function getRatingLabel(rating: number) {
  return `${rating} / 10`;
}

function MediaArtwork({ category }: { category: MediaCategory }) {
  if (category === "MUSIC") {
    return (
      <>
        <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#caf0f8]/35 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.28),transparent_18%),radial-gradient(circle,#023e8a_0_22%,#90e0ef_23%_25%,#03045e_26%_100%)] shadow-[0_0_42px_rgba(202,240,248,0.16)]" />
        <div className="absolute left-[18%] right-[18%] top-[64%] flex items-end justify-center gap-1.5 opacity-60">
          {[22, 34, 18, 42, 26, 36, 20].map((height) => (
            <span
              key={height}
              className="w-1 rounded-full bg-[#caf0f8]/55"
              style={{ height }}
            />
          ))}
        </div>
      </>
    );
  }

  if (category === "BOOK") {
    return (
      <>
        <div className="absolute left-1/2 top-1/2 h-28 w-36 -translate-x-1/2 -translate-y-1/2 rounded-md border border-[#caf0f8]/25 bg-[#caf0f8]/10 shadow-[0_22px_60px_rgba(0,20,45,0.24)]" />
        <div className="absolute left-1/2 top-1/2 h-24 w-32 -translate-x-[54%] -translate-y-[54%] rounded-md border border-[#caf0f8]/20 bg-[#eaf8ff]/[0.12]" />
        <div className="absolute left-1/2 top-1/2 h-20 w-px -translate-y-1/2 bg-[#caf0f8]/[0.24]" />
        <div className="absolute left-[43%] top-[40%] h-px w-10 bg-[#caf0f8]/[0.28]" />
        <div className="absolute left-[43%] top-[48%] h-px w-8 bg-[#caf0f8]/20" />
        <div className="absolute left-[43%] top-[56%] h-px w-12 bg-[#caf0f8]/[0.18]" />
      </>
    );
  }

  if (category === "MOVIE") {
    return (
      <>
        <div className="absolute left-1/2 top-1/2 h-24 w-40 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#caf0f8]/[0.28] bg-[#03045e]/[0.28] shadow-[0_18px_50px_rgba(0,20,45,0.22)]">
          <div className="absolute inset-x-4 top-1/2 h-px bg-[#caf0f8]/[0.24]" />
          <div className="absolute inset-y-3 left-5 w-px bg-[#caf0f8]/20" />
          <div className="absolute inset-y-3 right-5 w-px bg-[#caf0f8]/20" />
        </div>
        <div className="absolute left-[24%] top-[31%] grid gap-1.5 opacity-55">
          {[0, 1, 2, 3].map((dot) => (
            <span key={dot} className="size-1.5 rounded-full bg-[#caf0f8]/60" />
          ))}
        </div>
        <div className="absolute right-[24%] top-[31%] grid gap-1.5 opacity-55">
          {[0, 1, 2, 3].map((dot) => (
            <span key={dot} className="size-1.5 rounded-full bg-[#caf0f8]/60" />
          ))}
        </div>
      </>
    );
  }

  if (category === "ANIME") {
    return (
      <>
        <div className="absolute left-[24%] top-[28%] size-16 rounded-full bg-[#caf0f8]/[0.16] blur-sm" />
        <div className="absolute right-[22%] top-[42%] size-24 rounded-full bg-[#90e0ef]/[0.12] blur-lg" />
        <div className="absolute left-1/2 top-1/2 h-24 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#023e8a]/[0.18] blur-xl" />
        {[
          ["left-[30%]", "top-[34%]"],
          ["left-[62%]", "top-[28%]"],
          ["left-[45%]", "top-[58%]"],
          ["left-[72%]", "top-[62%]"],
        ].map(([left, top]) => (
          <span
            key={`${left}-${top}`}
            className={`absolute ${left} ${top} size-1.5 rounded-full bg-[#caf0f8]/70 shadow-[0_0_14px_rgba(202,240,248,0.5)]`}
          />
        ))}
      </>
    );
  }

  return (
    <>
      <div className="absolute left-1/2 top-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 grid-cols-4 gap-1.5 opacity-70">
        {Array.from({ length: 16 }, (_, index) => (
          <span
            key={index}
            className={
              index === 1 ||
              index === 4 ||
              index === 5 ||
              index === 6 ||
              index === 9 ||
              index === 10 ||
              index === 14
                ? "rounded-sm bg-[#caf0f8]/45"
                : "rounded-sm bg-[#023e8a]/35"
            }
          />
        ))}
      </div>
      <div className="absolute bottom-[26%] right-[24%] flex gap-2 opacity-70">
        <span className="size-3 rounded-full border border-[#caf0f8]/50" />
        <span className="size-3 rounded-full border border-[#caf0f8]/35" />
      </div>
    </>
  );
}

export function MediaCoverPlaceholder({
  category,
  label,
  title,
  variant = "card",
}: {
  category: MediaCategory;
  label: string;
  title?: string;
  variant?: "card" | "detail";
}) {
  const sizeClass = variant === "detail" ? "min-h-[420px]" : "h-56";

  return (
    <div
      className={`relative flex ${sizeClass} items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_32%_18%,rgba(202,240,248,0.18),transparent_30%),linear-gradient(135deg,#023e8a_0%,#005f8f_48%,#001f3f_100%)] px-6 text-center transition duration-500 group-hover:scale-[1.02]`}
      role="img"
      aria-label={`${label} category artwork`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_12%_84%,rgba(72,202,228,0.12),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#001f3f]/55 to-transparent" />
      <MediaArtwork category={category} />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#caf0f8]/85">
          {label}
        </p>
        {title ? (
          <p className="mx-auto mt-4 max-w-sm text-2xl font-bold leading-tight text-white">
            {title}
          </p>
        ) : null}
      </div>
    </div>
  );
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(202,240,248,0.16),transparent_32%),linear-gradient(180deg,#0077b6_0%,#005f8f_46%,#003b73_100%)] px-6 py-20 text-white">
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
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/[0.72] shadow-lg shadow-[#03045e]/20 backdrop-blur transition hover:-translate-y-1 hover:border-[#caf0f8]/50 hover:bg-[#03045e]/[0.62]"
              >
                {item.coverUrl ? (
                  <div className="h-56 overflow-hidden bg-[#03045e]/45">
                    <div
                      className="h-full bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                      style={{
                        backgroundImage: `url(${item.coverUrl})`,
                      }}
                      aria-label={`${item.title}${t.media.coverImageLabelSuffix}`}
                    />
                  </div>
                ) : (
                  <MediaCoverPlaceholder
                    category={item.category}
                    label={getCategoryLabel(item.category, t.media.categories)}
                  />
                )}

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#caf0f8]/40 bg-[#caf0f8]/10 px-3 py-1 text-xs font-semibold text-[#caf0f8]">
                      {getCategoryLabel(item.category, t.media.categories)}
                    </span>

                    {item.rating !== null && (
                      <span className="rounded-full border border-[#caf0f8]/25 bg-[#caf0f8]/[0.08] px-3 py-1 text-xs font-semibold text-[#caf0f8]/80">
                        {getRatingLabel(item.rating)}
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
                    <p className="mt-5 line-clamp-2 text-sm leading-6 text-[#caf0f8]/80">
                      {item.note}
                    </p>
                  )}

                  <p className="mt-auto pt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#caf0f8] opacity-80 transition group-hover:opacity-100">
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
