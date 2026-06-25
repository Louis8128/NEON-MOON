import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type MediaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function getMediaItem(id: string) {
  const mediaItemId = Number(id);

  if (!Number.isInteger(mediaItemId) || mediaItemId <= 0) {
    notFound();
  }

  const mediaItem = await prisma.mediaItem.findUnique({
    where: {
      id: mediaItemId,
    },
    select: {
      id: true,
      title: true,
      category: true,
      creator: true,
      releaseYear: true,
      coverUrl: true,
      rating: true,
      note: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!mediaItem) {
    notFound();
  }

  return mediaItem;
}

export default async function MediaDetailPage({
  params,
}: MediaDetailPageProps) {
  const { id } = await params;
  const mediaItem = await getMediaItem(id);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/media"
          className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to Media
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Cover image area. */}
          {/* 中文关键词：媒体封面展示区域。 */}
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/20">
            {mediaItem.coverUrl ? (
              <div
                className="min-h-[420px] bg-cover bg-center"
                style={{
                  backgroundImage: `url(${mediaItem.coverUrl})`,
                }}
                aria-label={`${mediaItem.title} cover image`}
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 px-8 text-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                    No Cover
                  </p>
                  <p className="mt-4 text-2xl font-bold text-white">
                    {mediaItem.title}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Main media information. */}
          {/* 中文关键词：媒体详情主要信息。 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
              Media Detail
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                {formatCategory(mediaItem.category)}
              </span>

              {mediaItem.rating !== null && (
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {mediaItem.rating}/10
                </span>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              {mediaItem.title}
            </h1>

            <div className="mt-6 grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Creator
                </p>
                <p className="mt-2 text-base text-white">
                  {mediaItem.creator ?? "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Release Year
                </p>
                <p className="mt-2 text-base text-white">
                  {mediaItem.releaseYear ?? "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Created
                </p>
                <p className="mt-2 text-base text-white">
                  {formatDate(mediaItem.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Updated
                </p>
                <p className="mt-2 text-base text-white">
                  {formatDate(mediaItem.updatedAt)}
                </p>
              </div>
            </div>

            <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-semibold text-white">
                Personal note
              </h2>

              {mediaItem.note ? (
                <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-slate-300">
                  {mediaItem.note}
                </p>
              ) : (
                <p className="mt-4 text-base leading-8 text-slate-500">
                  No note has been added for this media item yet.
                </p>
              )}
            </section>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/media"
                className="rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/60 hover:text-white"
              >
                View all media
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
