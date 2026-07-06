"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";
import { useI18n } from "@/components/I18nProvider";
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

function getCategoryLabel(
  category: MediaCategory,
  labels: ReturnType<typeof useI18n>["t"]["mediaAdmin"]["categories"],
) {
  return labels[category.toLowerCase() as Lowercase<MediaCategory>];
}

function getFilterLabel(
  filter: MediaFilter,
  labels: ReturnType<typeof useI18n>["t"]["mediaAdmin"]["categories"],
) {
  return filter === "ALL" ? labels.all : getCategoryLabel(filter, labels);
}

export default function MediaAdminPage() {
  const { locale, t } = useI18n();
  const copy = t.mediaAdmin;
  const dateLocale = locale === "zh" ? "zh-CN" : "en-AU";

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
  const loadMediaItems = useCallback(
    async function loadMediaItems() {
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
        throw new Error(result.error ?? copy.failedToLoadMediaItems);
      }

      setMediaItems(result.mediaItems ?? []);
    },
    [copy.failedToLoadMediaItems],
  );

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
            : copy.failedToLoadMediaItemsUnexpected,
        );
      } finally {
        setIsLoading(false);
      }
    }

    void initializeMediaItems();
  }, [copy.failedToLoadMediaItemsUnexpected, loadMediaItems]);

  // Delete one media item after a browser confirmation.
  // 删除前弹出确认框，确认后才调用删除 API。
  async function handleDeleteMediaItem(item: MediaItemSummary) {
    const confirmed = window.confirm(
      `${copy.deleteConfirmPrefix}${item.title}${copy.deleteConfirmSuffix}`,
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
        setError(result.error ?? copy.failedToDeleteMediaItem);
        return;
      }

      // Remove the deleted item from local React state after database deletion.
      // 数据库删除成功后，同步从前端列表移除。
      setMediaItems((currentItems) =>
        currentItems.filter((mediaItem) => mediaItem.id !== item.id),
      );
    } catch {
      setError(copy.failedToDeleteMediaItemUnexpected);
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
        <AdminHeader
          section={copy.adminName}
          links={[
            {
              href: "/media",
              label: copy.viewPublicMedia,
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
                  ? copy.loadingMediaItems
                  : formatCountLabel(
                      locale,
                      mediaItems.length,
                      copy.itemSingular,
                      copy.itemPlural,
                      copy.foundSuffix,
                    )}
              </div>

              <Link
                href="/media/admin/new"
                className="rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
              >
                {copy.newMediaItem}
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
                  {getFilterLabel(targetFilter, copy.categories)}{" "}
                  ({getFilterCount(targetFilter)})
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-8 text-[#eaf8ff]">
                {copy.loadingMediaItems}
              </div>
            ) : filteredMediaItems.length === 0 ? (
              // Empty state for the current filter.
              // 当前筛选结果为空时显示提示。
              <div className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
                <p className="text-lg font-semibold text-[#f8fcff]">
                  {copy.noMediaItemsInView}
                </p>
                <p className="mt-2 text-sm text-[#caf0f8]/80">
                  {copy.noMediaItemsHint}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75">
                <div className="grid grid-cols-12 border-b border-[#caf0f8]/25 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]/65">
                  <div className="col-span-4">{copy.title}</div>
                  <div className="col-span-2">{copy.category}</div>
                  <div className="col-span-2">{copy.creator}</div>
                  <div className="col-span-2">{copy.rating}</div>
                  <div className="col-span-2 text-right">{copy.actions}</div>
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
                            {copy.releasedIn} {item.releaseYear}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-[#caf0f8]/55">
                          {copy.updatedOn}{" "}
                          {new Date(item.updatedAt).toLocaleDateString(
                            dateLocale,
                          )}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <span className="rounded-full border border-[#caf0f8]/40 px-3 py-1 text-xs font-semibold text-[#caf0f8]">
                          {getCategoryLabel(item.category, copy.categories)}
                        </span>
                      </div>

                      <div className="col-span-2 truncate text-[#caf0f8]/80">
                        {item.creator ?? copy.unknown}
                      </div>

                      <div className="col-span-2 text-[#eaf8ff]">
                        {item.rating === null
                          ? copy.notRated
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
                            {copy.edit}
                          </Link>

                          <button
                            type="button"
                            disabled={deletingMediaItemId === item.id}
                            onClick={() => handleDeleteMediaItem(item)}
                            className="text-xs font-semibold text-red-300 transition hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingMediaItemId === item.id
                              ? copy.deleting
                              : copy.delete}
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
