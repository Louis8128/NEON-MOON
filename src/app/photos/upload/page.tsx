"use client";

import { ChangeEvent, FormEvent, useState } from "react";
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

  async function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUnlockError("");
    setIsUnlocking(true);

    try {
      const response = await fetch("/api/photos/auth", {
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
        setUnlockError(result.error ?? "Invalid upload password.");
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

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Send the already-verified password again.
    // The upload API still checks it on the server for real protection.
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

      router.push("/photos");
      router.refresh();
    } catch {
      setError("Something went wrong while uploading the photo.");
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
            href="/photos"
            className="text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            {" "}
            View public gallery{" "}
          </Link>{" "}
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
            Upload Photo
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Add a new photo
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Unlock the upload form with the admin password, then upload a local
            image file and save its details into the database.
          </p>
        </div>

        {!isUnlocked ? (
          <form
            onSubmit={handleUnlock}
            className="mt-10 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20"
          >
            <div>
              <label
                htmlFor="unlockPassword"
                className="block text-sm font-semibold text-slate-200"
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
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
              <p className="mt-2 text-xs text-slate-500">
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
              className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUnlocking ? "Checking..." : "Unlock upload form"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20"
          >
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              Upload form unlocked.
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-sm font-semibold text-slate-200"
              >
                Image file
              </label>

              <div className="mt-2 flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
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
                  className="cursor-pointer rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Choose file
                </label>

                <span className="min-w-0 truncate text-sm text-slate-400">
                  {selectedFileName}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Supported formats: JPG, PNG, WEBP. Maximum size: 8MB.
              </p>
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
                name="title"
                type="text"
                required
                placeholder="Enter a photo title"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-slate-200"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter a location"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="takenAt"
                className="block text-sm font-semibold text-slate-200"
              >
                Taken date
              </label>
              <input
                id="takenAt"
                name="takenAt"
                type="date"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-200"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Write a short note about this photo..."
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
              {isSubmitting ? "Uploading..." : "Upload photo"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
