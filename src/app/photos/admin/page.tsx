"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";
import { useI18n } from "@/components/I18nProvider";
import {
  readJsonResponse,
  redirectIfUnauthorized,
} from "@/lib/adminClientAuth";

type PhotoSummary = {
  id: number;
  title: string;
  imageUrl: string;
  location: string | null;
  description: string | null;
  takenAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatDate(dateValue: string | null, locale: string, unknownText: string) {
  if (!dateValue) {
    return unknownText;
  }

  return new Date(dateValue).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCountLabel(
  locale: string,
  count: number,
  singular: string,
  plural: string,
  foundSuffix: string,
) {
  if (locale === "zh") {
    return `${count} ${plural}${foundSuffix}`;
  }

  return `${count} ${count === 1 ? singular : plural} ${foundSuffix}`;
}

export default function PhotosAdminPage() {
  const { locale, t } = useI18n();
  const copy = t.photosAdmin;
  const dateLocale = locale === "zh" ? "zh-CN" : "en-AU";

  // Photo records loaded from the database.
  // 从数据库读取到的照片记录列表。
  const [photos, setPhotos] = useState<PhotoSummary[]>([]);

  // General error message shown on the page.
  // 页面错误提示。
  const [error, setError] = useState("");

  // Success message shown after admin actions.
  // 后台操作成功提示。
  const [successMessage, setSuccessMessage] = useState("");

  // Photo id currently being deleted.
  // 当前正在删除的照片 id。
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);

  // Loading state for photo loading.
  // 加载状态，防止重复提交。
  const [isLoading, setIsLoading] = useState(true);

  // Load all photo records from the protected admin API.
  // 加载后台照片管理列表。
  const loadPhotos = useCallback(
    async function loadPhotos() {
      const response = await fetch("/api/photos/admin/list", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (redirectIfUnauthorized(response)) {
        return;
      }

      const result = await readJsonResponse<{
        photos?: PhotoSummary[];
        error?: string;
      }>(response);

      if (!response.ok) {
        throw new Error(result.error ?? copy.failedToLoadPhotos);
      }

      setPhotos(result.photos ?? []);
    },
    [copy.failedToLoadPhotos],
  );

  useEffect(() => {
    async function initializePhotos() {
      setError("");
      setIsLoading(true);

      try {
        await loadPhotos();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : copy.failedToLoadPhotosUnexpected,
        );
      } finally {
        setIsLoading(false);
      }
    }

    void initializePhotos();
  }, [copy.failedToLoadPhotosUnexpected, loadPhotos]);

  async function handleDeletePhoto(photo: PhotoSummary) {
    const shouldDelete = window.confirm(
      `${copy.deleteConfirmPrefix}${photo.title}${copy.deleteConfirmSuffix}`,
    );

    if (!shouldDelete) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setDeletingPhotoId(photo.id);

    try {
      const response = await fetch("/api/photos/admin/delete", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: photo.id,
        }),
      });

      if (redirectIfUnauthorized(response)) {
        return;
      }

      const result = await readJsonResponse<{ error?: string }>(response);

      if (!response.ok) {
        throw new Error(result.error ?? copy.failedToDeletePhoto);
      }

      setPhotos((currentPhotos) =>
        currentPhotos.filter((currentPhoto) => currentPhoto.id !== photo.id),
      );
      setSuccessMessage(copy.deletedSuccessfully);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy.failedToDeletePhotoUnexpected,
      );
    } finally {
      setDeletingPhotoId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <AdminHeader
          section={{
            en: "Photos Admin",
            zh: "照片管理",
          }}
          links={[
            {
              href: "/photos",
              label: {
                en: "View public gallery",
                zh: "查看公开相册",
              },
              muted: true,
            },
          ]}
        />

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            {copy.adminName}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {copy.manageTitle}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {copy.manageDescription}
          </p>
        </div>

        {
          <section className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
                {isLoading
                  ? copy.loadingPhotos
                  : formatCountLabel(
                      locale,
                      photos.length,
                      copy.photoSingular,
                      copy.photoPlural,
                      copy.foundSuffix,
                    )}
              </div>

              <Link
                href="/photos/upload"
                className="rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
              >
                {copy.uploadPhoto}
              </Link>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
                {successMessage}
              </div>
            )}

            {isLoading ? (
              <div className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-8 text-[#eaf8ff]">
                {copy.loadingPhotos}
              </div>
            ) : photos.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
                <p className="text-lg font-semibold text-[#f8fcff]">
                  {copy.noPhotosFound}
                </p>

                <p className="mt-2 text-sm text-[#caf0f8]/80">
                  {copy.noPhotosHint}
                </p>
              </div>
            ) : (
              // Photo admin card grid.
              // 照片后台卡片列表。
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {photos.map((photo) => (
                  <article
                    key={photo.id}
                    className="overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 shadow-lg shadow-[#03045e]/20 backdrop-blur"
                  >
                    <div
                      className="h-56 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${photo.imageUrl})`,
                      }}
                      aria-label={`${photo.title}${copy.imagePreviewSuffix}`}
                    />

                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#caf0f8]">
                        {copy.photoNumberPrefix}
                        {photo.id}
                      </p>

                      <h2 className="mt-3 text-2xl font-bold text-white">
                        {photo.title}
                      </h2>

                      <div className="mt-4 space-y-2 text-sm text-[#caf0f8]/80">
                        <p>
                          <span className="text-[#caf0f8]/65">
                            {copy.location}:{" "}
                          </span>
                          {photo.location ?? copy.unknown}
                        </p>

                        <p>
                          <span className="text-[#caf0f8]/65">
                            {copy.taken}:{" "}
                          </span>
                          {formatDate(
                            photo.takenAt,
                            dateLocale,
                            copy.unknown,
                          )}
                        </p>

                        <p>
                          <span className="text-[#caf0f8]/65">
                            {copy.updated}:{" "}
                          </span>
                          {formatDate(
                            photo.updatedAt,
                            dateLocale,
                            copy.unknown,
                          )}
                        </p>
                      </div>

                      {photo.description && (
                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#caf0f8]/80">
                          {photo.description}
                        </p>
                      )}

                      <p className="mt-5 break-all rounded-2xl border border-[#caf0f8]/25 bg-[#03045e]/65 px-3 py-2 text-xs text-[#caf0f8]/65">
                        {photo.imageUrl}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href={`/photos/${photo.id}`}
                          className="rounded-full border border-[#caf0f8]/40 px-4 py-2 text-xs font-semibold text-[#caf0f8] transition hover:bg-[#caf0f8] hover:text-[#023e8a]"
                        >
                          {copy.view}
                        </Link>

                        <Link
                          href={`/photos/admin/edit/${photo.id}`}
                          className="rounded-full bg-[#caf0f8] px-4 py-2 text-xs font-semibold text-[#023e8a] transition hover:bg-white"
                        >
                          {copy.edit}
                        </Link>

                        <button
                          type="button"
                          disabled={deletingPhotoId === photo.id}
                          onClick={() => void handleDeletePhoto(photo)}
                          className="rounded-full border border-red-300/50 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingPhotoId === photo.id
                            ? copy.deleting
                            : copy.delete}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        }
      </div>
    </main>
  );
}
