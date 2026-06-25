"use client";

import { FormEvent, useEffect, useState } from "react";
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

export default function AdminNewBlogPostPage() {
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

  async function verifyPassword(password: string) {
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
  }

  useEffect(() => {
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
        setIsUnlocked(true);
      } catch {
        sessionStorage.removeItem("neonMoonAdminPassword");
        setUnlockError(
          "Saved admin session expired. Please enter the password again.",
        );
      } finally {
        setIsUnlocking(false);
      }
    }
    void unlockWithSavedPassword(savedPassword);
  }, []);

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUnlockError("");
    setIsUnlocking(true);

    try {
      await verifyPassword(adminPassword);

      sessionStorage.setItem("neonMoonAdminPassword", adminPassword);
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
        router.push("/blog/admin");
      }

      router.refresh();
    } catch {
      setError("Something went wrong while creating the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="text-sm font-semibold text-[#caf0f8] transition hover:text-white"
          >
            ← Back to Admin Dashboard
          </Link>

          <Link
            href="/blog/admin"
            className="text-sm font-semibold text-[#caf0f8]/80 transition hover:text-white"
          >
            Back to Blog Admin
          </Link>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Blog Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Create a new post
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            Create a new blog post from the admin area and save it into the
            database.
          </p>
        </div>
        {!isUnlocked ? (
          <form
            onSubmit={handleUnlock}
            className="mt-10 space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
          >
            <div>
              <label
                htmlFor="adminPassword"
                className="block text-sm font-semibold text-[#f8fcff]"
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
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
              <p className="mt-2 text-xs text-[#caf0f8]/65">
                The password is checked by the server before the editor is
                shown.
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
              className="w-full rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUnlocking ? "Checking..." : "Unlock editor"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
          >
            <div className="rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
              Blog editor unlocked.
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
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Enter a blog title"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-semibold text-[#f8fcff]"
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
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
              <p className="mt-2 text-xs text-[#caf0f8]/65">
                Used in the URL. Use lowercase letters, numbers, and hyphens
                only.
              </p>
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Write a short summary..."
                className="mt-2 w-full resize-none rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm leading-6 text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="coverImageUrl"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Cover image URL
              </label>
              <input
                id="coverImageUrl"
                type="text"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                placeholder="Optional cover image path"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-[#f8fcff]"
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
                className="mt-2 w-full resize-none rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm leading-6 text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-[#eaf8ff]">
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
              className="w-full rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create blog post"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
