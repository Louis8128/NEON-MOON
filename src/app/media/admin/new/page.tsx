"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  // Admin password used by the protected create API.
  // 管理员密码，用于调用新增媒体 API。
  const [adminPassword, setAdminPassword] = useState("");

  // Whether the media editor is unlocked.
  // 是否已经解锁新增媒体表单。
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Unlock error shown before the form is available.
  // 解锁阶段的错误提示。
  const [unlockError, setUnlockError] = useState("");

  // Loading state while checking the admin password.
  // 检查密码时的加载状态。
  const [isUnlocking, setIsUnlocking] = useState(false);

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

  // Reuse the existing admin password verification API.
  // The create API will still check the password again before writing to MySQL.
  // 复用管理员密码验证，真正写入时 API 仍会再次验证。
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

  // Try to reuse the saved admin password during this browser session.
  // 读取 sessionStorage，避免重复输入管理员密码。
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("neonMoonAdminPassword");

    if (!savedPassword) {
      return;
    }

    async function unlockWithSavedPassword(password: string) {
      setUnlockError("");
      setIsUnlocking(true);

      try {
        await verifyPassword(password);
        setAdminPassword(password);
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
  }, [verifyPassword]);

  // Handle manual password unlock.
  // 处理手动输入管理员密码解锁表单。
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

  // Submit the new media item to the protected create API.
  // 提交新增媒体收藏到数据库。
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/media/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPassword,
          title,
          category,
          creator,
          releaseYear,
          coverUrl,
          rating,
          note,
        }),
      });

      const result = await response.json();

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
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/media/admin"
          className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to Media Admin
        </Link>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
            Media Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Add a new media item
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Add a movie, music record, book, anime, or game to your personal
            media collection.
          </p>
        </div>

        {!isUnlocked ? (
          // Password form shown before the media editor is unlocked.
          // 未解锁时显示管理员密码表单。
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
                The password is checked before the media editor is shown.
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
              {isUnlocking ? "Checking..." : "Unlock media editor"}
            </button>
          </form>
        ) : (
          // Main media creation form.
          // 解锁后的新增媒体收藏表单。
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20"
          >
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              Media editor unlocked.
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
                placeholder="Enter a title"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-slate-200"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as MediaCategory)
                }
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
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
                className="block text-sm font-semibold text-slate-200"
              >
                Creator
              </label>
              <input
                id="creator"
                type="text"
                value={creator}
                onChange={(event) => setCreator(event.target.value)}
                placeholder="Director, artist, author, studio..."
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="releaseYear"
                className="block text-sm font-semibold text-slate-200"
              >
                Release year
              </label>
              <input
                id="releaseYear"
                type="number"
                value={releaseYear}
                onChange={(event) => setReleaseYear(event.target.value)}
                placeholder="Optional release year"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-semibold text-slate-200"
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
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="coverUrl"
                className="block text-sm font-semibold text-slate-200"
              >
                Cover URL
              </label>
              <input
                id="coverUrl"
                type="text"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                placeholder="Optional cover image path or URL"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="note"
                className="block text-sm font-semibold text-slate-200"
              >
                Note
              </label>
              <textarea
                id="note"
                rows={6}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Write a short note about this media item..."
                className="mt-2 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
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
              className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create media item"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
