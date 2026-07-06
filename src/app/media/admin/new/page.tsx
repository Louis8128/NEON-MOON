"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import { useI18n } from "@/components/I18nProvider";
import {
  readJsonResponse,
  redirectIfUnauthorized,
} from "@/lib/adminClientAuth";

type MediaCategory = "MUSIC" | "BOOK" | "MOVIE" | "ANIME" | "GAME";

const mediaCategories: MediaCategory[] = [
  "MOVIE",
  "MUSIC",
  "BOOK",
  "ANIME",
  "GAME",
];

function getCategoryLabel(
  category: MediaCategory,
  labels: ReturnType<typeof useI18n>["t"]["mediaAdmin"]["categories"],
) {
  return labels[category.toLowerCase() as Lowercase<MediaCategory>];
}

export default function NewMediaItemPage() {
  const router = useRouter();
  const { t } = useI18n();
  const copy = t.mediaAdmin;

  // Form fields for the new media item.
  // 新增媒体收藏表单字段。
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MediaCategory>("MOVIE");
  const [creator, setCreator] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");

  // Submit state and error for creating a media item.
  // 提交新增媒体时的状态和错误。
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit the new media item to the protected create API.
  // 提交新增媒体收藏到数据库。
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/media/admin/create", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          creator,
          releaseYear,
          coverUrl,
          rating,
          note,
        }),
      });

      if (redirectIfUnauthorized(response)) {
        return;
      }

      const result = await readJsonResponse<{ error?: string }>(response);

      if (!response.ok) {
        setError(result.error ?? copy.failedToCreateMediaItem);
        return;
      }

      router.push("/media/admin");
      router.refresh();
    } catch {
      setError(copy.failedToCreateMediaItemUnexpected);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <AdminHeader
          section={copy.adminName}
          links={[
            {
              href: "/media/admin",
              label: copy.backToMediaAdmin,
              muted: true,
            },
          ]}
        />

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            {copy.adminName}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {copy.createTitle}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {copy.createDescription}
          </p>
        </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.title}
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={copy.titlePlaceholder}
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.category}
              </label>
              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as MediaCategory)
                }
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white outline-none transition focus:border-[#caf0f8]"
              >
                {mediaCategories.map((mediaCategory) => (
                  <option key={mediaCategory} value={mediaCategory}>
                    {getCategoryLabel(mediaCategory, copy.categories)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="creator"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.creator}
              </label>
              <input
                id="creator"
                type="text"
                value={creator}
                onChange={(event) => setCreator(event.target.value)}
                placeholder={copy.creatorPlaceholder}
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="releaseYear"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.releaseYear}
              </label>
              <input
                id="releaseYear"
                type="number"
                value={releaseYear}
                onChange={(event) => setReleaseYear(event.target.value)}
                placeholder={copy.releaseYearPlaceholder}
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.rating}
              </label>
              <input
                id="rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                placeholder={copy.ratingPlaceholder}
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="coverUrl"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.coverUrl}
              </label>
              <input
                id="coverUrl"
                type="text"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                placeholder={copy.coverUrlPlaceholder}
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="note"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.note}
              </label>
              <textarea
                id="note"
                rows={6}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={copy.notePlaceholder}
                className="mt-2 w-full resize-none rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm leading-6 text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? copy.creating : copy.createMediaItem}
            </button>
          </form>
      </div>
    </main>
  );
}
