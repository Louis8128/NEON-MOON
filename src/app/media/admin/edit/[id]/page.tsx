"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import {
  readJsonResponse,
  redirectIfUnauthorized,
} from "@/lib/adminClientAuth";

type MediaCategory = "MUSIC" | "BOOK" | "MOVIE" | "ANIME" | "GAME";

type MediaItemFormData = {
  id: number;
  title: string;
  category: MediaCategory;
  creator: string | null;
  releaseYear: number | null;
  coverUrl: string | null;
  rating: number | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

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

export default function EditMediaItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  // Media item id from the dynamic route: /media/admin/edit/[id]
  // 从动态路由里读取媒体条目 id。
  const mediaItemId = params.id;

  // Loading state for item loading.
  // 加载原始媒体数据时的状态。
  const [isLoading, setIsLoading] = useState(true);

  // Submit state for saving changes.
  // 保存修改时的提交状态。
  const [isSubmitting, setIsSubmitting] = useState(false);

  // General page error.
  // 页面错误提示。
  const [error, setError] = useState("");

  // Form fields.
  // 编辑表单字段。
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MediaCategory>("MOVIE");
  const [creator, setCreator] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [rating, setRating] = useState("");
  const [note, setNote] = useState("");

  // Metadata shown in the editor.
  // 显示创建和更新时间，不参与编辑。
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  // Load the media item from the protected admin item API.
  // 读取单个媒体记录，认证由 HttpOnly cookie 处理。
  const loadMediaItem = useCallback(
    async function loadMediaItem() {
      const response = await fetch("/api/media/admin/item", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: mediaItemId,
        }),
      });

      if (redirectIfUnauthorized(response)) {
        return;
      }

      const result = await readJsonResponse<{
        mediaItem?: MediaItemFormData;
        error?: string;
      }>(response);

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to load media item.");
      }

      const mediaItem = result.mediaItem as MediaItemFormData | undefined;

      if (!mediaItem) {
        throw new Error("Media item response is missing.");
      }

      setTitle(mediaItem.title);
      setCategory(mediaItem.category);
      setCreator(mediaItem.creator ?? "");
      setReleaseYear(
        mediaItem.releaseYear === null ? "" : String(mediaItem.releaseYear),
      );
      setCoverUrl(mediaItem.coverUrl ?? "");
      setRating(mediaItem.rating === null ? "" : String(mediaItem.rating));
      setNote(mediaItem.note ?? "");
      setCreatedAt(mediaItem.createdAt);
      setUpdatedAt(mediaItem.updatedAt);
    },
    [mediaItemId],
  );

  useEffect(() => {
    async function initializeMediaItem() {
      setError("");
      setIsLoading(true);

      try {
        await loadMediaItem();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the media item.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void initializeMediaItem();
  }, [loadMediaItem]);

  // Save edited media item data back to the database.
  // 把编辑后的媒体信息保存回数据库。
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/media/admin/update", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: mediaItemId,
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
        setError(result.error ?? "Failed to update media item.");
        return;
      }

      router.push("/media/admin");
      router.refresh();
    } catch {
      setError("Something went wrong while updating the media item.");
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
            Edit media item
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            Update the title, category, creator, release year, rating, cover
            URL, and personal note for this media item.
          </p>
        </div>

        {isLoading ? (
          <section className="mt-10 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-8 text-[#eaf8ff]">
            Loading media item...
          </section>
        ) : error && !title ? (
          <section className="mt-10 rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-red-200">
            {error}
          </section>
        ) : (
          // Main edit form after the media item has been loaded.
          // 读取数据后的编辑表单。
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
          >
            <div className="rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
              Editing media item #{mediaItemId}
              {updatedAt && (
                <span className="block pt-1 text-xs text-[#caf0f8]/80">
                  Last updated on{" "}
                  {new Date(updatedAt).toLocaleDateString("en-AU")}
                </span>
              )}
              {createdAt && (
                <span className="block pt-1 text-xs text-[#caf0f8]/70">
                  Created on {new Date(createdAt).toLocaleDateString("en-AU")}
                </span>
              )}
            </div>

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
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
