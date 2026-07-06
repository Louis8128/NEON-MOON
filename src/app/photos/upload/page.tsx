"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import { useI18n } from "@/components/I18nProvider";
import {
  readJsonResponse,
  redirectIfUnauthorized,
} from "@/lib/adminClientAuth";

export default function PhotoUploadPage() {
  const router = useRouter();
  const { t } = useI18n();
  const copy = t.photosAdmin;

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelectedFileName(file ? file.name : "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/photos/upload", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });

      if (redirectIfUnauthorized(response)) {
        return;
      }

      const result = await readJsonResponse<{ error?: string }>(response);

      if (!response.ok) {
        setError(result.error ?? copy.failedToUploadPhoto);
        return;
      }

      form.reset();
      setSelectedFileName("");

      // Return to the Photos Admin list after upload.
      // 上传成功后回到照片后台列表，方便继续管理。
      router.push("/photos/admin");
      router.refresh();
    } catch {
      setError(copy.failedToUploadPhotoUnexpected);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <AdminHeader
          section={copy.adminName}
          links={[
            {
              href: "/photos/admin",
              label: copy.backToPhotosAdmin,
              muted: true,
            },
            {
              href: "/photos",
              label: copy.viewPublicGallery,
              muted: true,
            },
          ]}
        />

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            {copy.uploadEyebrow}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {copy.uploadTitle}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {copy.uploadDescription}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
        >
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-semibold text-[#f8fcff]"
            >
              {copy.imageFile}
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
                {copy.chooseFile}
              </label>

              <span className="min-w-0 truncate text-sm text-[#caf0f8]/80">
                {selectedFileName || copy.noFileSelected}
              </span>
            </div>

            <p className="mt-2 text-xs text-[#caf0f8]/65">
              {copy.supportedFormats}
            </p>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-[#f8fcff]"
            >
              {copy.title}
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder={copy.titlePlaceholder}
              className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-[#f8fcff]"
            >
              {copy.location}
            </label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder={copy.locationPlaceholder}
              className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
            />
          </div>

          <div>
            <label
              htmlFor="takenAt"
              className="block text-sm font-semibold text-[#f8fcff]"
            >
              {copy.takenDate}
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
              {copy.descriptionLabel}
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder={copy.descriptionPlaceholder}
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
            {isSubmitting ? copy.uploading : copy.uploadPhoto}
          </button>
        </form>
      </div>
    </main>
  );
}
