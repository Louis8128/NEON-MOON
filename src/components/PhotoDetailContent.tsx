"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export type PhotoDetailItem = {
  title: string;
  imageUrl: string;
  location: string | null;
  description: string | null;
  takenAt: string | null;
};

function formatDate(dateValue: string, locale: string) {
  return new Date(dateValue).toLocaleDateString(locale);
}

export default function PhotoDetailContent({
  photo,
}: {
  photo: PhotoDetailItem;
}) {
  const { locale, t } = useI18n();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-AU";

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/photos"
          className="text-sm font-semibold text-[#caf0f8] transition hover:text-white"
        >
          {t.photos.backToPhotos}
        </Link>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            {t.photos.photoDetail}
          </p>

          <div className="mt-6 overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 shadow-lg shadow-[#03045e]/20 backdrop-blur">
            <div className="relative h-[70vh] min-h-[360px] w-full bg-[#023e8a]/75">
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  {photo.title}
                </h1>

                {photo.location && (
                  <p className="mt-3 text-sm font-medium text-[#caf0f8]/80">
                    {t.photos.location}: {photo.location}
                  </p>
                )}
              </div>

              {photo.takenAt && (
                <span className="rounded-full border border-[#caf0f8]/40 px-4 py-2 text-xs font-semibold text-[#caf0f8]">
                  {t.photos.takenAt}: {formatDate(photo.takenAt, dateLocale)}
                </span>
              )}
            </div>

            {photo.description && (
              <div className="mt-6 max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#caf0f8]/65">
                  {t.photos.descriptionLabel}
                </p>
                <p className="mt-3 text-base leading-8 text-[#eaf8ff]">
                  {photo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
