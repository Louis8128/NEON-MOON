"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

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
  // Admin password entered by the user.
  // 管理员密码，用于请求后台 API。
  const [adminPassword, setAdminPassword] = useState("");

  // Blog posts loaded from the database through /api/blog/admin/list.
  // 从数据库读取到的文章列表。
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);

  // Current filter used by the admin list.
  // 当前筛选状态。
  const [filter, setFilter] = useState<PostFilter>("ALL");

  // General error message shown on the page.
  // 页面错误提示。
  const [error, setError] = useState("");

  // Loading state for unlocking or loading the admin list.
  // 加载状态，防止重复提交。
  const [isLoading, setIsLoading] = useState(false);

  // Whether the admin list is unlocked.
  // 是否已经通过密码验证。
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Tracks which post is currently changing publish status.
  // 记录正在切换发布状态的文章 id。
  const [changingStatusPostId, setChangingStatusPostId] = useState<
    number | null
  >(null);

  // Load all blog posts from the protected admin API.
  // This function also saves the password into sessionStorage for this browser tab.
  // 加载后台文章列表，并保存当前会话密码。
  const loadPosts = useCallback(async function loadPosts(password: string) {
    const response = await fetch("/api/blog/admin/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adminPassword: password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "Failed to load blog posts.");
    }

    setPosts(result.posts ?? []);
    setAdminPassword(password);
    sessionStorage.setItem("neonMoonAdminPassword", password);
    setIsUnlocked(true);
  }, []);

  // Try to reuse the saved admin password when the user returns to this page.
  // This avoids asking for the password again during the same browser session.
  // 自动读取 sessionStorage，减少重复输入密码。
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("neonMoonAdminPassword");

    if (!savedPassword) {
      return;
    }

    async function unlockWithSavedPassword(password: string) {
      setError("");
      setIsLoading(true);

      try {
        await loadPosts(password);
      } catch (error) {
        // If the saved password is no longer valid, remove it and ask again.
        // 保存的密码失效后清除本地会话。
        sessionStorage.removeItem("neonMoonAdminPassword");
        setError(
          error instanceof Error
            ? error.message
            : "Saved admin session expired. Please enter the password again.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void unlockWithSavedPassword(savedPassword);
  }, [loadPosts]);

  // Handle the first password unlock form.
  // 处理管理员密码解锁表单。
  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await loadPosts(adminPassword);
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

  // Toggle one post between Published and Draft.
  // The server still checks the admin password before changing the database.
  // 快速切换文章发布状态，API 仍然会验证密码。
  async function handleTogglePublish(postId: number) {
    setError("");
    setChangingStatusPostId(postId);

    try {
      const response = await fetch("/api/blog/admin/toggle-publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          adminPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Failed to update publish status.");
        return;
      }

      // Update local React state after the database update succeeds.
      // 数据库更新成功后，同步更新前端列表。
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === result.post.id
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
      ? "rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      : "rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/60 hover:text-white";
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/blog"
          className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to Blog
        </Link>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
            Blog Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Manage blog posts
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Unlock the admin list to view published posts and drafts stored in
            the database.
          </p>
        </div>

        {!isUnlocked ? (
          // Password form shown before the admin list is unlocked.
          // 未解锁时显示密码表单。
          <form
            onSubmit={handleUnlock}
            className="mt-10 max-w-2xl space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20"
          >
            <div>
              <label
                htmlFor="adminPassword"
                className="block text-sm font-semibold text-slate-200"
              >
                Admin password
              </label>
              <input
                id="adminPassword"
                type="password"
                required
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                placeholder="Enter admin password"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
              <p className="mt-2 text-xs text-slate-500">
                The server checks this password before returning draft posts.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Loading..." : "Unlock admin list"}
            </button>
          </form>
        ) : (
          // Main admin list after password verification.
          // 解锁后显示后台文章管理列表。
          <section className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                Admin list unlocked. {posts.length} post
                {posts.length === 1 ? "" : "s"} found.
              </div>

              <Link
                href="/blog/admin/new"
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
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

            {filteredPosts.length === 0 ? (
              // Empty state for the current filter.
              // 当前筛选结果为空时显示提示。
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
                <p className="text-lg font-semibold text-slate-200">
                  No posts in this view.
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Switch filters or create a new blog post.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
                <div className="grid grid-cols-12 border-b border-slate-800 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-3">Slug</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Updated</div>
                </div>

                <div className="divide-y divide-slate-800">
                  {filteredPosts.map((post) => (
                    // One row in the admin table.
                    // 后台表格中的一篇文章记录。
                    <article
                      key={post.id}
                      className="grid grid-cols-12 items-center gap-3 px-5 py-5 text-sm"
                    >
                      <div className="col-span-5">
                        <p className="font-semibold text-white">{post.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Created on{" "}
                          {new Date(post.createdAt).toLocaleDateString("en-AU")}
                        </p>
                      </div>

                      <div className="col-span-3 truncate text-slate-400">
                        /blog/{post.slug}
                      </div>

                      <div className="col-span-2">
                        <span
                          className={
                            post.published
                              ? "rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold text-cyan-300"
                              : "rounded-full border border-amber-400/40 px-3 py-1 text-xs font-semibold text-amber-300"
                          }
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>

                      <div className="col-span-2 text-right">
                        <p className="text-xs text-slate-500">
                          {new Date(post.updatedAt).toLocaleDateString("en-AU")}
                        </p>

                        {/* Row actions: edit, view, and publish status toggle. */}
                        {/* 单篇文章操作按钮：编辑、查看、发布状态切换。 */}
                        <div className="mt-2 flex justify-end gap-3">
                          <Link
                            href={`/blog/admin/edit/${post.id}`}
                            className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                          >
                            Edit
                          </Link>

                          {post.published && (
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-xs font-semibold text-slate-300 transition hover:text-white"
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
        )}
      </div>
    </main>
  );
}
