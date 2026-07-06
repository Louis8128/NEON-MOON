"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
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

function formatCategory(category: MediaCategory) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export default function NewMediaItemPage() {
  const router = useRouter();

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
        setError(result.error ?? "Failed to create media item.");
        return;
      }

      router.push("/media/admin");
      router.refresh();
    } catch {
      setError("Something went wrong while creating the media item.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <AdminHeader
          section={{
            en: "Media Admin",
            zh: "媒体管理",
          }}
          links={[
            {
              href: "/media/admin",
              label: {
                en: "Back to Media Admin",
                zh: "返回媒体管理",
              },
              muted: true,
            },
          ]}
        />

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Media Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Add a new media item
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            Add a movie, music record, book, anime, or game to your personal
            media collection.
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
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter a title"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Category
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
                    {formatCategory(mediaCategory)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="creator"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Creator
              </label>
              <input
                id="creator"
                type="text"
                value={creator}
                onChange={(event) => setCreator(event.target.value)}
                placeholder="Director, artist, author, studio..."
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="releaseYear"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Release year
              </label>
              <input
                id="releaseYear"
                type="number"
                value={releaseYear}
                onChange={(event) => setReleaseYear(event.target.value)}
                placeholder="Optional release year"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Rating
              </label>
              <input
                id="rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                placeholder="Optional rating from 0 to 10"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="coverUrl"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Cover URL
              </label>
              <input
                id="coverUrl"
                type="text"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                placeholder="Optional cover image path or URL"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="note"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Note
              </label>
              <textarea
                id="note"
                rows={6}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Write a short note about this media item..."
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
              {isSubmitting ? "Creating..." : "Create media item"}
            </button>
          </form>
      </div>
    </main>
  );
}
