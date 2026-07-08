"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export type PhotoGalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
  location: string | null;
  description: string | null;
  takenAt: string | null;
};

function formatDate(dateValue: string, locale: string) {
  return new Date(dateValue).toLocaleDateString(locale);
}

export default function PhotoGalleryContent({
  photos,
}: {
  photos: PhotoGalleryItem[];
}) {
  const { locale, t } = useI18n();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-AU";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(202,240,248,0.16),transparent_32%),linear-gradient(180deg,#0077b6_0%,#005f8f_46%,#003b73_100%)] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#caf0f8]">
            {t.photos.eyebrow}
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight">
            {t.photos.title}
          </h1>

          {t.photos.description ? (
            <p className="max-w-2xl text-lg leading-8 text-[#eaf8ff]">
              {t.photos.description}
            </p>
          ) : null}
        </div>

        {photos.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              {t.photos.noPhotosYet}
            </p>
            <p className="mt-2 text-sm text-[#caf0f8]/80">
              {t.photos.noPhotosDescription}
            </p>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {photos.map((photo) => (
              <Link
                key={photo.id}
                href={`/photos/${photo.id}`}
                className="group block overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 shadow-lg shadow-[#03045e]/20 backdrop-blur transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
              >
                <article>
                  <div className="relative h-64 w-full overflow-hidden bg-[#023e8a]/75">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-2xl font-bold text-white">
                        {photo.title}
                      </h2>

                      {photo.takenAt && (
                        <span className="rounded-full border border-[#caf0f8]/40 px-3 py-1 text-xs font-semibold text-[#caf0f8]">
                          {formatDate(photo.takenAt, dateLocale)}
                        </span>
                      )}
                    </div>

                    {photo.location && (
                      <p className="text-sm font-medium text-[#caf0f8]/80">
                        {t.photos.location}: {photo.location}
                      </p>
                    )}

                    {photo.description && (
                      <p className="mt-4 text-sm leading-6 text-[#eaf8ff]">
                        {photo.description}
                      </p>
                    )}

                    <p className="mt-5 text-sm font-semibold text-[#caf0f8] transition group-hover:text-[#caf0f8]">
                      {t.photos.viewPhoto} →
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
