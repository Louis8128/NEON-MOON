"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type BlogPostDetail = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminEditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [adminPassword, setAdminPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postId = Number(params.id);
  const isInvalidPostId = !Number.isInteger(postId) || postId <= 0;

  const verifyPassword = useCallback(async function verifyPassword(
    password: string,
  ) {
    const response = await fetch("/api/blog/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "Invalid admin password.");
    }

    return true;
  }, []);

  const loadPost = useCallback(
    async function loadPost(password: string) {
      setIsLoadingPost(true);
      setError("");

      try {
        const response = await fetch("/api/blog/admin/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: postId,
            adminPassword: password,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Failed to load blog post.");
        }

        const loadedPost = result.post as BlogPostDetail;

        setPost(loadedPost);
        setTitle(loadedPost.title);
        setSlug(loadedPost.slug);
        setExcerpt(loadedPost.excerpt ?? "");
        setContent(loadedPost.content);
        setCoverImageUrl(loadedPost.coverImageUrl ?? "");
        setPublished(loadedPost.published);
      } finally {
        setIsLoadingPost(false);
      }
    },
    [postId],
  );

  useEffect(() => {
    if (isInvalidPostId) {
      return;
    }

    const savedPassword = sessionStorage.getItem("neonMoonAdminPassword");

    if (!savedPassword) {
      return;
    }

    async function unlockWithSavedPassword(password: string) {
      setIsUnlocking(true);
      setUnlockError("");

      try {
        await verifyPassword(password);
        setAdminPassword(password);
        await loadPost(password);
        setIsUnlocked(true);
      } catch (error) {
        sessionStorage.removeItem("neonMoonAdminPassword");
        setUnlockError(
          error instanceof Error
            ? error.message
            : "Saved admin session expired. Please enter the password again.",
        );
      } finally {
        setIsUnlocking(false);
      }
    }

    void unlockWithSavedPassword(savedPassword);
  }, [isInvalidPostId, loadPost, verifyPassword]);

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUnlockError("");
    setIsUnlocking(true);

    try {
      await verifyPassword(adminPassword);

      sessionStorage.setItem("neonMoonAdminPassword", adminPassword);
      await loadPost(adminPassword);
      setIsUnlocked(true);
    } catch (error) {
      setUnlockError(
        error instanceof Error ? error.message : "Invalid admin password.",
      );
    } finally {
      setIsUnlocking(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/blog/admin/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          adminPassword,
          title,
          slug,
          excerpt,
          content,
          coverImageUrl,
          published,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Failed to update blog post.");
        return;
      }

      router.refresh();

      if (result.post?.published) {
        router.push(`/blog/${result.post.slug}`);
      } else {
        router.push("/blog/admin");
      }
    } catch {
      setError("Something went wrong while updating the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap gap-3">
          {" "}
          <Link
            href="/admin"
            className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            {" "}
            ← Back to Admin Dashboard{" "}
          </Link>{" "}
          <Link
            href="/blog/admin"
            className="text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            {" "}
            Back to Blog Admin{" "}
          </Link>{" "}
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
            Blog Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Edit blog post
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Update an existing blog post, change its publication status, and
            save the changes back to the database.
          </p>
        </div>

        {isInvalidPostId ? (
          <section className="mt-10 rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-red-200">
            Invalid blog post id.
          </section>
        ) : !isUnlocked ? (
          <form
            onSubmit={handleUnlock}
            className="mt-10 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20"
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
                The password is checked by the server before the post is loaded.
              </p>
            </div>

            {unlockError && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {unlockError}
              </div>
            )}

            <button
              type="submit"
              disabled={isUnlocking}
              className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUnlocking ? "Checking..." : "Unlock editor"}
            </button>
          </form>
        ) : isLoadingPost ? (
          <section className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-slate-300">
            Loading blog post...
          </section>
        ) : post ? (
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20"
          >
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              Editing post #{post.id}. Last updated on{" "}
              {new Date(post.updatedAt).toLocaleDateString("en-AU")}.
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-slate-200"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter a blog title"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-semibold text-slate-200"
              >
                Slug
              </label>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="Enter a URL slug"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
              <p className="mt-2 text-xs text-slate-500">
                Used in the URL. Changing it will also change the public blog
                post URL.
              </p>
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-semibold text-slate-200"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Write a short summary..."
                className="mt-2 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="coverImageUrl"
                className="block text-sm font-semibold text-slate-200"
              >
                Cover image URL
              </label>
              <input
                id="coverImageUrl"
                type="text"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                placeholder="Optional cover image path"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-slate-200"
              >
                Content
              </label>
              <textarea
                id="content"
                rows={12}
                required
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write the full blog content here..."
                className="mt-2 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="h-4 w-4"
              />
              Publish this post
            </label>

            {error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </form>
        ) : (
          <section className="mt-10 rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-red-200">
            Blog post could not be loaded.
          </section>
        )}
      </div>
    </main>
  );
}
