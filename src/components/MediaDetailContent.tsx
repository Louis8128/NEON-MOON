"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import {
  MediaCoverPlaceholder,
  type MediaCategory,
} from "@/components/MediaListContent";

export type MediaDetailItem = {
  id: number;
  title: string;
  category: MediaCategory;
  creator: string | null;
  releaseYear: number | null;
  coverUrl: string | null;
  rating: number | null;
  note: string | null;
  createdAt: string;
};

function formatDate(dateValue: string, locale: string) {
  return new Date(dateValue).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getCategoryLabel(
  category: MediaCategory,
  labels: ReturnType<typeof useI18n>["t"]["media"]["categories"],
) {
  const categoryKey = category.toLowerCase() as keyof typeof labels;
  return labels[categoryKey];
}

function getRatingLabel(rating: number) {
  return `${rating} / 10`;
}

export default function MediaDetailContent({
  mediaItem,
}: {
  mediaItem: MediaDetailItem;
}) {
  const { locale, t } = useI18n();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-AU";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(202,240,248,0.16),transparent_32%),linear-gradient(180deg,#0077b6_0%,#005f8f_46%,#003b73_100%)] px-6 py-20 text-white">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/media"
          className="text-sm font-semibold text-[#caf0f8] transition hover:text-white"
        >
          {t.media.backToMedia}
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 shadow-xl shadow-[#03045e]/20 backdrop-blur">
            {mediaItem.coverUrl ? (
              <div className="overflow-hidden bg-[#03045e]/45">
                <div
                  className="min-h-[420px] bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${mediaItem.coverUrl})`,
                  }}
                  aria-label={`${mediaItem.title}${t.media.coverImageLabelSuffix}`}
                />
              </div>
            ) : (
              <MediaCoverPlaceholder
                category={mediaItem.category}
                label={getCategoryLabel(
                  mediaItem.category,
                  t.media.categories,
                )}
                title={mediaItem.title}
                variant="detail"
              />
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
              {t.media.mediaDetail}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#caf0f8]/40 bg-[#caf0f8]/10 px-3 py-1 text-xs font-semibold text-[#caf0f8]">
                {getCategoryLabel(mediaItem.category, t.media.categories)}
              </span>

              {mediaItem.rating !== null && (
                <span className="rounded-full border border-[#caf0f8]/25 bg-[#caf0f8]/[0.08] px-3 py-1 text-xs font-semibold text-[#caf0f8]/80">
                  {getRatingLabel(mediaItem.rating)}
                </span>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              {mediaItem.title}
            </h1>

            <div className="mt-6 grid gap-4 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-5 text-sm text-[#eaf8ff] sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#caf0f8]/65">
                  {t.media.creator}
                </p>
                <p className="mt-2 text-base text-white">
                  {mediaItem.creator ?? t.media.unknown}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#caf0f8]/65">
                  {t.media.releaseYear}
                </p>
                <p className="mt-2 text-base text-white">
                  {mediaItem.releaseYear ?? t.media.unknown}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#caf0f8]/65">
                  {t.media.addedToCollection}
                </p>
                <p className="mt-2 text-base text-white">
                  {formatDate(mediaItem.createdAt, dateLocale)}
                </p>
              </div>
            </div>

            <section className="mt-8 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6">
              <h2 className="text-xl font-semibold text-white">
                {t.media.personalNote}
              </h2>

              {mediaItem.note ? (
                <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-[#eaf8ff]">
                  {mediaItem.note}
                </p>
              ) : (
                <p className="mt-4 text-base leading-8 text-[#caf0f8]/65">
                  {t.media.noNote}
                </p>
              )}
            </section>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/media"
                className="rounded-full border border-[#caf0f8]/50 px-5 py-3 text-sm font-semibold text-[#caf0f8] transition hover:bg-[#caf0f8] hover:text-[#023e8a]"
              >
                {t.media.viewAllMedia}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
