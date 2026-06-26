"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type PhotoSummary = {
  id: number;
  title: string;
  imageUrl: string;
  location: string | null;
  description: string | null;
  takenAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "Unknown";
  }

  return new Date(dateValue).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PhotosAdminPage() {
  // Admin password entered by the user.
  // 管理员密码，用于访问后台 Photos API。
  const [adminPassword, setAdminPassword] = useState("");

  // Photo records loaded from the database.
  // 从数据库读取到的照片记录列表。
  const [photos, setPhotos] = useState<PhotoSummary[]>([]);

  // General error message shown on the page.
  // 页面错误提示。
  const [error, setError] = useState("");

  // Success message shown after admin actions.
  // 后台操作成功提示。
  const [successMessage, setSuccessMessage] = useState("");

  // Photo id currently being deleted.
  // 当前正在删除的照片 id。
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);

  // Loading state for password unlock and photo loading.
  // 加载状态，防止重复提交。
  const [isLoading, setIsLoading] = useState(false);

  // Whether the admin list is unlocked.
  // 是否已经通过密码验证。
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Load all photo records from the protected admin API.
  // 加载后台照片管理列表。
  const loadPhotos = useCallback(async function loadPhotos(password: string) {
    const response = await fetch("/api/photos/admin/list", {
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
      throw new Error(result.error ?? "Failed to load photos.");
    }

    setPhotos(result.photos ?? []);
    setAdminPassword(password);
    sessionStorage.setItem("neonMoonAdminPassword", password);
    setIsUnlocked(true);
  }, []);

  // Try to reuse the saved admin password during the same browser session.
  // 复用 sessionStorage 中的管理员密码，避免重复输入。
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("neonMoonAdminPassword");

    if (!savedPassword) {
      return;
    }

    async function unlockWithSavedPassword(password: string) {
      setError("");
      setIsLoading(true);

      try {
        await loadPhotos(password);
      } catch (error) {
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
  }, [loadPhotos]);

  // Handle the first password unlock form.
  // 处理管理员密码解锁表单。
  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await loadPhotos(adminPassword);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading photos.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeletePhoto(photo: PhotoSummary) {
    const shouldDelete = window.confirm(
      `Delete "${photo.title}"? This cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setDeletingPhotoId(photo.id);

    try {
      const response = await fetch("/api/photos/admin/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminPassword,
          id: photo.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to delete photo.");
      }

      setPhotos((currentPhotos) =>
        currentPhotos.filter((currentPhoto) => currentPhoto.id !== photo.id),
      );
      setSuccessMessage("Photo deleted successfully.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the photo.",
      );
    } finally {
      setDeletingPhotoId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="text-sm font-semibold text-[#caf0f8] transition hover:text-white"
          >
            ← Back to Admin Dashboard
          </Link>

          <Link
            href="/photos"
            className="text-sm font-semibold text-[#caf0f8]/80 transition hover:text-white"
          >
            View public gallery
          </Link>
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Photos Admin
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Manage photography records
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            Unlock the admin list to view photo records stored in the database.
          </p>
        </div>

        {!isUnlocked ? (
          // Password form shown before the photo admin list is unlocked.
          // 未解锁时显示管理员密码表单。
          <form
            onSubmit={handleUnlock}
            className="mt-10 max-w-2xl space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
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
                The server checks this password before returning photo records.
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
              className="w-full rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Loading..." : "Unlock photos admin"}
            </button>
          </form>
        ) : (
          // Main photo admin list after password verification.
          // 解锁后显示照片后台管理列表。
          <section className="mt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
                Photos admin unlocked. {photos.length} photo
                {photos.length === 1 ? "" : "s"} found.
              </div>

              <Link
                href="/photos/upload"
                className="rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
              >
                Upload photo
              </Link>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
                {successMessage}
              </div>
            )}

            {photos.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
                <p className="text-lg font-semibold text-[#f8fcff]">
                  No photos found.
                </p>

                <p className="mt-2 text-sm text-[#caf0f8]/80">
                  Upload a photo to start building the gallery.
                </p>
              </div>
            ) : (
              // Photo admin card grid.
              // 照片后台卡片列表。
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {photos.map((photo) => (
                  <article
                    key={photo.id}
                    className="overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 shadow-lg shadow-[#03045e]/20 backdrop-blur"
                  >
                    <div
                      className="h-56 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${photo.imageUrl})`,
                      }}
                      aria-label={`${photo.title} image preview`}
                    />

                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#caf0f8]">
                        Photo #{photo.id}
                      </p>

                      <h2 className="mt-3 text-2xl font-bold text-white">
                        {photo.title}
                      </h2>

                      <div className="mt-4 space-y-2 text-sm text-[#caf0f8]/80">
                        <p>
                          <span className="text-[#caf0f8]/65">Location: </span>
                          {photo.location ?? "Unknown"}
                        </p>

                        <p>
                          <span className="text-[#caf0f8]/65">Taken: </span>
                          {formatDate(photo.takenAt)}
                        </p>

                        <p>
                          <span className="text-[#caf0f8]/65">Updated: </span>
                          {formatDate(photo.updatedAt)}
                        </p>
                      </div>

                      {photo.description && (
                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#caf0f8]/80">
                          {photo.description}
                        </p>
                      )}

                      <p className="mt-5 break-all rounded-2xl border border-[#caf0f8]/25 bg-[#03045e]/65 px-3 py-2 text-xs text-[#caf0f8]/65">
                        {photo.imageUrl}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href={`/photos/${photo.id}`}
                          className="rounded-full border border-[#caf0f8]/40 px-4 py-2 text-xs font-semibold text-[#caf0f8] transition hover:bg-[#caf0f8] hover:text-[#023e8a]"
                        >
                          View
                        </Link>

                        <Link
                          href={`/photos/admin/edit/${photo.id}`}
                          className="rounded-full bg-[#caf0f8] px-4 py-2 text-xs font-semibold text-[#023e8a] transition hover:bg-white"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={deletingPhotoId === photo.id}
                          onClick={() => void handleDeletePhoto(photo)}
                          className="rounded-full border border-red-300/50 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingPhotoId === photo.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
