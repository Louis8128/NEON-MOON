"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type BlogPostSummary = {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function BlogAdminPage() {
  const [adminPassword, setAdminPassword] = useState("");
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/blog/admin/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Failed to load blog posts.");
        return;
      }

      setPosts(result.posts ?? []);
      setIsUnlocked(true);
    } catch {
      setError("Something went wrong while loading blog posts.");
    } finally {
      setIsLoading(false);
    }
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
          <section className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                Admin list unlocked. {posts.length} post
                {posts.length === 1 ? "" : "s"} found.
              </div>

              <Link
                href="/blog/new"
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                New post
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
                <p className="text-lg font-semibold text-slate-200">
                  No blog posts yet.
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Create your first post from the New post page.
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
                  {posts.map((post) => (
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

                        {post.published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="mt-2 inline-block text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                          >
                            View →
                          </Link>
                        )}
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
