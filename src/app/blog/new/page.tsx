"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function generateSlugFromTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewBlogPostPage() {
  const router = useRouter();

  const [adminPassword, setAdminPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(true);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(generateSlugFromTitle(value));
    }
  }

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUnlockError("");
    setIsUnlocking(true);

    try {
      const response = await fetch("/api/blog/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: adminPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setUnlockError(result.error ?? "Invalid admin password.");
        return;
      }

      setIsUnlocked(true);
    } catch {
      setUnlockError("Something went wrong while checking the password.");
    } finally {
      setIsUnlocking(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        setError(result.error ?? "Failed to create blog post.");
        return;
      }

      if (result.post?.published) {
        router.push(`/blog/${result.post.slug}`);
      } else {
        router.push("/blog");
      }

      router.refresh();
    } catch {
      setError("Something went wrong while creating the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to Blog
        </Link>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
            New Blog Post
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Write a new post
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Unlock the editor with the admin password, then create a new blog
            post and save it into the database.
          </p>
        </div>

        {!isUnlocked ? (
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
                This only unlocks the editor UI. The API will verify the
                password again when you submit the post.
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
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20"
          >
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              Blog editor unlocked.
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
                onChange={(event) => handleTitleChange(event.target.value)}
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
                placeholder="my-first-post"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
              <p className="mt-2 text-xs text-slate-500">
                Used in the URL. Example: /blog/my-first-post
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
                placeholder="/photos/ocean-sunset.jpg"
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
              Publish this post immediately
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
              {isSubmitting ? "Creating..." : "Create blog post"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
