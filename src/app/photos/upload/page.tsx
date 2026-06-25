"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PhotoUploadPage() {
  const router = useRouter();

  const [adminPassword, setAdminPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("No file selected");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelectedFileName(file ? file.name : "No file selected");
  }

  // Verify the admin password through the existing photo auth API.
  // 通过现有照片上传验证 API 检查管理员密码。
  const verifyPassword = useCallback(async function verifyPassword(
    password: string,
  ) {
    const response = await fetch("/api/photos/auth", {
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
      throw new Error(result.error ?? "Invalid upload password.");
    }

    return true;
  }, []);

  // Try to reuse the saved admin password during the same browser session.
  // 自动复用 sessionStorage 中的管理员密码，避免重复输入。
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
  // 手动输入管理员密码解锁上传表单。
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
        error instanceof Error ? error.message : "Invalid upload password.",
      );
    } finally {
      setIsUnlocking(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Send the already-verified password again.
    // The upload API still checks it on the server for real protection.
    // 前端解锁只是提升体验，真正保护仍在后端 API。
    formData.set("adminPassword", adminPassword);

    try {
      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Failed to upload photo.");
        return;
      }

      form.reset();
      setSelectedFileName("No file selected");

      // Return to the Photos Admin list after upload.
      // 上传成功后回到照片后台列表，方便继续管理。
      router.push("/photos/admin");
      router.refresh();
    } catch {
      setError("Something went wrong while uploading the photo.");
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
            href="/photos/admin"
            className="text-sm font-semibold text-[#caf0f8]/80 transition hover:text-white"
          >
            Back to Photos Admin
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
            Upload Photo
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Add a new photo
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            Unlock the upload form with the admin password, then upload a local
            image file and save its details into the database.
          </p>
        </div>

        {!isUnlocked ? (
          <form
            onSubmit={handleUnlock}
            className="mt-10 space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
          >
            <div>
              <label
                htmlFor="unlockPassword"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Admin password
              </label>

              <input
                id="unlockPassword"
                type="password"
                required
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                placeholder="Enter upload password"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />

              <p className="mt-2 text-xs text-[#caf0f8]/65">
                This protects the upload form from public access.
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
              {isUnlocking ? "Checking..." : "Unlock upload form"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
          >
            <div className="rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
              Upload form unlocked.
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Image file
              </label>

              <div className="mt-2 flex items-center gap-4 rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={handleFileChange}
                  className="sr-only"
                />

                <label
                  htmlFor="file"
                  className="cursor-pointer rounded-full bg-[#caf0f8] px-4 py-2 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
                >
                  Choose file
                </label>

                <span className="min-w-0 truncate text-sm text-[#caf0f8]/80">
                  {selectedFileName}
                </span>
              </div>

              <p className="mt-2 text-xs text-[#caf0f8]/65">
                Supported formats: JPG, PNG, WEBP. Maximum size: 8MB.
              </p>
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
                name="title"
                type="text"
                required
                placeholder="Enter a photo title"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter a location"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="takenAt"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Taken date
              </label>

              <input
                id="takenAt"
                name="takenAt"
                type="date"
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Write a short note about this photo..."
                className="mt-2 w-full resize-none rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm leading-6 text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
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
              className="w-full rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Uploading..." : "Upload photo"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
