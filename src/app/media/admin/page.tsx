"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  readJsonResponse,
  redirectIfUnauthorized,
} from "@/lib/adminClientAuth";

type MediaCategory = "MUSIC" | "BOOK" | "MOVIE" | "ANIME" | "GAME";

type MediaItemSummary = {
  id: number;
  title: string;
  category: MediaCategory;
  creator: string | null;
  releaseYear: number | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
};

type MediaFilter = "ALL" | MediaCategory;

const mediaFilters: MediaFilter[] = [
  "ALL",
  "MOVIE",
  "MUSIC",
  "BOOK",
  "ANIME",
  "GAME",
];

function formatCategory(category: MediaCategory) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export default function MediaAdminPage() {
  // Media items loaded from the database.
  // 从数据库读取到的媒体收藏列表。
  const [mediaItems, setMediaItems] = useState<MediaItemSummary[]>([]);

  // Current category filter.
  // 当前分类筛选状态。
  const [filter, setFilter] = useState<MediaFilter>("ALL");

  // General error message shown on the page.
  // 页面错误提示。
  const [error, setError] = useState("");

  // Loading state for data loading.
  // 加载状态，防止重复提交。
  const [isLoading, setIsLoading] = useState(true);

  // Tracks which media item is currently being deleted.
  // 记录正在删除的媒体条目 id。
  const [deletingMediaItemId, setDeletingMediaItemId] = useState<number | null>(
    null,
  );

  // Load all media items from the protected admin API.
  // 加载后台媒体收藏列表。
  const loadMediaItems = useCallback(async function loadMediaItems() {
    const response = await fetch("/api/media/admin/list", {
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
      mediaItems?: MediaItemSummary[];
      error?: string;
    }>(response);

    if (!response.ok) {
      throw new Error(result.error ?? "Failed to load media items.");
    }

    setMediaItems(result.mediaItems ?? []);
  }, []);

  useEffect(() => {
    async function initializeMediaItems() {
      setError("");
      setIsLoading(true);

      try {
        await loadMediaItems();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading media items.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void initializeMediaItems();
  }, [loadMediaItems]);

  // Delete one media item after a browser confirmation.
  // 删除前弹出确认框，确认后才调用删除 API。
  async function handleDeleteMediaItem(item: MediaItemSummary) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingMediaItemId(item.id);

    try {
      const response = await fetch("/api/media/admin/delete", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
        }),
      });

      if (redirectIfUnauthorized(response)) {
        return;
      }

      const result = await readJsonResponse<{ error?: string }>(response);

      if (!response.ok) {
        setError(result.error ?? "Failed to delete media item.");
        return;
      }

      // Remove the deleted item from local React state after database deletion.
      // 数据库删除成功后，同步从前端列表移除。
      setMediaItems((currentItems) =>
        currentItems.filter((mediaItem) => mediaItem.id !== item.id),
      );
    } catch {
      setError("Something went wrong while deleting the media item.");
    } finally {
      setDeletingMediaItemId(null);
    }
  }

  const filteredMediaItems = mediaItems.filter((item) => {
    if (filter === "ALL") {
      return true;
    }

    return item.category === filter;
  });

  function getFilterCount(targetFilter: MediaFilter) {
    if (targetFilter === "ALL") {
      return mediaItems.length;
    }

    return mediaItems.filter((item) => item.category === targetFilter).length;
  }

  function getFilterButtonClass(targetFilter: MediaFilter) {
    return filter === targetFilter
      ? "rounded-full bg-[#caf0f8] px-4 py-2 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
      : "rounded-full border border-[#caf0f8]/50 px-4 py-2 text-sm font-semibold text-[#caf0f8] transition hover:bg-[#caf0f8] hover:text-[#023e8a]";
  }

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap gap-3">
          {" "}
          <Link
            href="/admin"
            className="text-sm font-semibold text-[#caf0f8] transition hover:text-white"
          >
            {" "}
            ← Back to Admin Dashboard{" "}
          </Link>{" "}
          <Link
            href="/media"
            className="text-sm font-semibold text-[#caf0f8]/80 transition hover:text-white"
          >
            {" "}
            View public media{" "}
          </Link>{" "}
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Media Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Manage media collection
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            View, edit, create, and delete media items stored in the database.
          </p>
        </div>

        {
          <section className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
                {isLoading
                  ? "Loading media items..."
                  : `${mediaItems.length} item${mediaItems.length === 1 ? "" : "s"} found.`}
              </div>

              <Link
                href="/media/admin/new"
                className="rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
              >
                New media item
              </Link>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Category filter buttons. */}
            {/* 媒体分类筛选按钮。 */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {mediaFilters.map((targetFilter) => (
                <button
                  key={targetFilter}
                  type="button"
                  onClick={() => setFilter(targetFilter)}
                  className={getFilterButtonClass(targetFilter)}
                >
                  {targetFilter === "ALL"
                    ? "All"
                    : formatCategory(targetFilter)}{" "}
                  ({getFilterCount(targetFilter)})
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-8 text-[#eaf8ff]">
                Loading media items...
              </div>
            ) : filteredMediaItems.length === 0 ? (
              // Empty state for the current filter.
              // 当前筛选结果为空时显示提示。
              <div className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
                <p className="text-lg font-semibold text-[#f8fcff]">
                  No media items in this view.
                </p>
                <p className="mt-2 text-sm text-[#caf0f8]/80">
                  Switch filters or add new media items.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75">
                <div className="grid grid-cols-12 border-b border-[#caf0f8]/25 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]/65">
                  <div className="col-span-4">Title</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Creator</div>
                  <div className="col-span-2">Rating</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-[#caf0f8]/20">
                  {filteredMediaItems.map((item) => (
                    // One row in the admin table.
                    // 后台表格中的一条媒体收藏记录。
                    <article
                      key={item.id}
                      className="grid grid-cols-12 items-center gap-3 px-5 py-5 text-sm"
                    >
                      <div className="col-span-4">
                        <p className="font-semibold text-white">{item.title}</p>

                        {item.releaseYear && (
                          <p className="mt-1 text-xs text-[#caf0f8]/65">
                            Released in {item.releaseYear}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-[#caf0f8]/55">
                          Updated on{" "}
                          {new Date(item.updatedAt).toLocaleDateString("en-AU")}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <span className="rounded-full border border-[#caf0f8]/40 px-3 py-1 text-xs font-semibold text-[#caf0f8]">
                          {formatCategory(item.category)}
                        </span>
                      </div>

                      <div className="col-span-2 truncate text-[#caf0f8]/80">
                        {item.creator ?? "Unknown"}
                      </div>

                      <div className="col-span-2 text-[#eaf8ff]">
                        {item.rating === null
                          ? "Not rated"
                          : `${item.rating}/10`}
                      </div>

                      <div className="col-span-2 text-right">
                        {/* Row actions for editing and deleting one media item. */}
                        {/* 单条媒体收藏的编辑和删除按钮。 */}
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/media/admin/edit/${item.id}`}
                            className="text-xs font-semibold text-[#caf0f8] transition hover:text-white"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={deletingMediaItemId === item.id}
                            onClick={() => handleDeleteMediaItem(item)}
                            className="text-xs font-semibold text-red-300 transition hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingMediaItemId === item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        }
      </div>
    </main>
  );
}
