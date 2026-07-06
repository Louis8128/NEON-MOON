"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import {
  readJsonResponse,
  redirectIfUnauthorized,
} from "@/lib/adminClientAuth";

type PhotoItem = {
  id: number;
  title: string;
  imageUrl: string;
  location: string | null;
  description: string | null;
  takenAt: string | null;
};

type PhotoFormState = {
  title: string;
  imageUrl: string;
  location: string;
  description: string;
  takenAt: string;
};

const emptyFormState: PhotoFormState = {
  title: "",
  imageUrl: "",
  location: "",
  description: "",
  takenAt: "",
};

function formatDateInputValue(dateValue: string | null) {
  if (!dateValue) return "";
  return new Date(dateValue).toISOString().slice(0, 10);
}

export default function PhotoAdminEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const photoId = params.id;

  const [formValues, setFormValues] =
    useState<PhotoFormState>(emptyFormState);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load one protected photo record with the HttpOnly admin cookie.
  // 使用 HttpOnly admin cookie 读取单张照片记录。
  const loadPhoto = useCallback(
    async function loadPhoto() {
      if (!photoId) {
        setError("A valid photo id is required.");
        setIsLoading(false);
        return;
      }

      setError("");
      setIsLoading(true);
      setIsReady(false);

      try {
        const response = await fetch("/api/photos/admin/item", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: photoId,
          }),
        });

        if (redirectIfUnauthorized(response)) {
          return;
        }

        const result = await readJsonResponse<{
          photo?: PhotoItem;
          error?: string;
        }>(response);

        if (!response.ok) {
          throw new Error(result.error ?? "Failed to load photo details.");
        }

        const photo = result.photo as PhotoItem | undefined;

        if (!photo) {
          throw new Error("Photo details were not returned.");
        }

        setFormValues({
          title: photo.title,
          imageUrl: photo.imageUrl,
          location: photo.location ?? "",
          description: photo.description ?? "",
          takenAt: formatDateInputValue(photo.takenAt),
        });
        setIsReady(true);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the photo.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [photoId],
  );

  useEffect(() => {
    async function initializeEditPage() {
      await loadPhoto();
    }

    void initializeEditPage();
  }, [loadPhoto]);

  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const fieldName = event.target.name as keyof PhotoFormState;
    const fieldValue = event.target.value;

    setFormValues((currentFormValues) => ({
      ...currentFormValues,
      [fieldName]: fieldValue,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/photos/admin/update", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: photoId,
          title: formValues.title,
          imageUrl: formValues.imageUrl,
          location: formValues.location,
          description: formValues.description,
          takenAt: formValues.takenAt || null,
        }),
      });

      if (redirectIfUnauthorized(response)) {
        return;
      }

      const result = await readJsonResponse<{ error?: string }>(response);

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to update photo.");
      }

      router.push("/photos/admin");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the photo.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <AdminHeader
          section={{
            en: "Photos Admin",
            zh: "照片管理",
          }}
          links={[
            {
              href: "/photos/admin",
              label: {
                en: "Back to Photos Admin",
                zh: "返回照片管理",
              },
              muted: true,
            },
            {
              href: `/photos/${photoId}`,
              label: {
                en: "View public photo",
                zh: "查看公开照片",
              },
              muted: true,
            },
          ]}
        />

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Edit Photo
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Update photo details
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            Edit the database record for this photo without changing the public
            gallery navigation.
          </p>
        </div>

        {isLoading ? (
          <div className="mt-10 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 text-sm text-[#caf0f8] shadow-lg shadow-[#03045e]/20 backdrop-blur">
            Loading photo details...
          </div>
        ) : !isReady ? (
          <div className="mt-10 rounded-3xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
            <p>{error}</p>

            <Link
              href="/photos/admin"
              className="mt-4 inline-flex rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
            >
              Return to Photos Admin
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
          >
            <div className="rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
              Editing photo #{photoId}.
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
                value={formValues.title}
                onChange={handleFieldChange}
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                Image URL
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                required
                value={formValues.imageUrl}
                onChange={handleFieldChange}
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
                value={formValues.location}
                onChange={handleFieldChange}
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
                value={formValues.takenAt}
                onChange={handleFieldChange}
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
                value={formValues.description}
                onChange={handleFieldChange}
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
              disabled={isSaving}
              className="w-full rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
