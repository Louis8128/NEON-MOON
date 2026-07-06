"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  readJsonResponse,
  redirectIfUnauthorized,
} from "@/lib/adminClientAuth";

// Shape of one blog post row returned by the admin list API.
// 后台文章列表里每一篇文章的数据结构。
type BlogPostSummary = {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

// Admin page filter state.
// 后台筛选模式：全部、已发布、草稿。
type PostFilter = "ALL" | "PUBLISHED" | "DRAFT";

export default function BlogAdminPage() {
  // Blog posts loaded from the database through /api/blog/admin/list.
  // 从数据库读取到的文章列表。
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);

  // Current filter used by the admin list.
  // 当前筛选状态。
  const [filter, setFilter] = useState<PostFilter>("ALL");

  // General error message shown on the page.
  // 页面错误提示。
  const [error, setError] = useState("");

  // Loading state for loading the admin list.
  // 加载状态，防止重复提交。
  const [isLoading, setIsLoading] = useState(true);

  // Tracks which post is currently changing publish status.
  // 记录正在切换发布状态的文章 id。
  const [changingStatusPostId, setChangingStatusPostId] = useState<
    number | null
  >(null);

  // Load all blog posts from the protected admin API.
  // 加载后台文章列表，认证由 HttpOnly cookie 处理。
  const loadPosts = useCallback(async function loadPosts() {
    const response = await fetch("/api/blog/admin/list", {
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
      posts?: BlogPostSummary[];
      error?: string;
    }>(response);

    if (!response.ok) {
      throw new Error(result.error ?? "Failed to load blog posts.");
    }

    setPosts(result.posts ?? []);
  }, []);

  useEffect(() => {
    async function initializePosts() {
      setError("");
      setIsLoading(true);

      try {
        await loadPosts();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading blog posts.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void initializePosts();
  }, [loadPosts]);

  // Toggle one post between Published and Draft.
  // 快速切换文章发布状态，API 通过 HttpOnly cookie 验证。
  async function handleTogglePublish(postId: number) {
    setError("");
    setChangingStatusPostId(postId);

    try {
      const response = await fetch("/api/blog/admin/toggle-publish", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
        }),
      });

      if (redirectIfUnauthorized(response)) {
        return;
      }

      const result = await readJsonResponse<{
        post?: {
          id: number;
          published: boolean;
          updatedAt: string;
        };
        error?: string;
      }>(response);

      if (!response.ok) {
        setError(result.error ?? "Failed to update publish status.");
        return;
      }

      if (!result.post) {
        setError("Publish status response is missing.");
        return;
      }

      // Update local React state after the database update succeeds.
      // 数据库更新成功后，同步更新前端列表。
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === result.post?.id
            ? {
                ...post,
                published: result.post.published,
                updatedAt: result.post.updatedAt,
              }
            : post,
        ),
      );
    } catch {
      setError("Something went wrong while updating publish status.");
    } finally {
      setChangingStatusPostId(null);
    }
  }

  // Count posts by status for the filter buttons.
  // 统计已发布和草稿数量。
  const publishedCount = posts.filter((post) => post.published).length;
  const draftCount = posts.filter((post) => !post.published).length;

  // Apply the selected filter before rendering the table.
  // 根据当前筛选状态决定显示哪些文章。
  const filteredPosts = posts.filter((post) => {
    if (filter === "PUBLISHED") {
      return post.published;
    }

    if (filter === "DRAFT") {
      return !post.published;
    }

    return true;
  });

  // Shared Tailwind class logic for filter buttons.
  // 根据当前筛选状态切换按钮样式。
  function getFilterButtonClass(targetFilter: PostFilter) {
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
            href="/blog"
            className="text-sm font-semibold text-[#caf0f8]/80 transition hover:text-white"
          >
            {" "}
            View public blog{" "}
          </Link>{" "}
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Blog Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Manage blog posts
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            View published posts and drafts stored in the database.
          </p>
        </div>

        {
          <section className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
                {isLoading
                  ? "Loading blog posts..."
                  : `${posts.length} post${posts.length === 1 ? "" : "s"} found.`}
              </div>

              <Link
                href="/blog/admin/new"
                className="rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
              >
                New post
              </Link>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Filter buttons for All / Published / Draft. */}
            {/* 后台文章状态筛选按钮。 */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className={getFilterButtonClass("ALL")}
              >
                All ({posts.length})
              </button>

              <button
                type="button"
                onClick={() => setFilter("PUBLISHED")}
                className={getFilterButtonClass("PUBLISHED")}
              >
                Published ({publishedCount})
              </button>

              <button
                type="button"
                onClick={() => setFilter("DRAFT")}
                className={getFilterButtonClass("DRAFT")}
              >
                Draft ({draftCount})
              </button>
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-8 text-[#eaf8ff]">
                Loading blog posts...
              </div>
            ) : filteredPosts.length === 0 ? (
              // Empty state for the current filter.
              // 当前筛选结果为空时显示提示。
              <div className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
                <p className="text-lg font-semibold text-[#f8fcff]">
                  No posts in this view.
                </p>
                <p className="mt-2 text-sm text-[#caf0f8]/80">
                  Switch filters or create a new blog post.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75">
                <div className="grid grid-cols-12 border-b border-[#caf0f8]/25 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]/65">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-3">Slug</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Updated</div>
                </div>

                <div className="divide-y divide-[#caf0f8]/20">
                  {filteredPosts.map((post) => (
                    // One row in the admin table.
                    // 后台表格中的一篇文章记录。
                    <article
                      key={post.id}
                      className="grid grid-cols-12 items-center gap-3 px-5 py-5 text-sm"
                    >
                      <div className="col-span-5">
                        <p className="font-semibold text-white">{post.title}</p>
                        <p className="mt-1 text-xs text-[#caf0f8]/65">
                          Created on{" "}
                          {new Date(post.createdAt).toLocaleDateString("en-AU")}
                        </p>
                      </div>

                      <div className="col-span-3 truncate text-[#caf0f8]/80">
                        /blog/{post.slug}
                      </div>

                      <div className="col-span-2">
                        <span
                          className={
                            post.published
                              ? "rounded-full border border-[#caf0f8]/40 px-3 py-1 text-xs font-semibold text-[#caf0f8]"
                              : "rounded-full border border-amber-400/40 px-3 py-1 text-xs font-semibold text-amber-300"
                          }
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>

                      <div className="col-span-2 text-right">
                        <p className="text-xs text-[#caf0f8]/65">
                          {new Date(post.updatedAt).toLocaleDateString("en-AU")}
                        </p>

                        {/* Row actions: edit, view, and publish status toggle. */}
                        {/* 单篇文章操作按钮：编辑、查看、发布状态切换。 */}
                        <div className="mt-2 flex justify-end gap-3">
                          <Link
                            href={`/blog/admin/edit/${post.id}`}
                            className="text-xs font-semibold text-[#caf0f8] transition hover:text-white"
                          >
                            Edit
                          </Link>

                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-xs font-semibold text-[#eaf8ff] transition hover:text-white"
                            >
                              View
                            </Link>
                          )}

                          <button
                            type="button"
                            disabled={changingStatusPostId === post.id}
                            onClick={() => handleTogglePublish(post.id)}
                            className={
                              post.published
                                ? "text-xs font-semibold text-amber-300 transition hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                                : "text-xs font-semibold text-emerald-300 transition hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                            }
                          >
                            {changingStatusPostId === post.id
                              ? "Updating..."
                              : post.published
                                ? "Unpublish"
                                : "Publish"}
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
