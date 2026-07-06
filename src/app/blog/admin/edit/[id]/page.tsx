"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import { useI18n } from "@/components/I18nProvider";
import {
  readJsonResponse,
  redirectIfUnauthorized,
} from "@/lib/adminClientAuth";

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
  const { locale, t } = useI18n();
  const copy = t.blogAdmin;
  const dateLocale = locale === "zh" ? "zh-CN" : "en-AU";

  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);

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

  const loadPost = useCallback(
    async function loadPost() {
      setIsLoadingPost(true);
      setError("");

      try {
        const response = await fetch("/api/blog/admin/post", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: postId,
          }),
        });

        if (redirectIfUnauthorized(response)) {
          return;
        }

        const result = await readJsonResponse<{
          post?: BlogPostDetail;
          error?: string;
        }>(response);

        if (!response.ok) {
          throw new Error(result.error ?? copy.failedToLoadPost);
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
    [copy.failedToLoadPost, postId],
  );

  useEffect(() => {
    if (isInvalidPostId) {
      return;
    }

    async function initializePost() {
      try {
        await loadPost();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : copy.failedToLoadPostUnexpected,
        );
      }
    }

    void initializePost();
  }, [copy.failedToLoadPostUnexpected, isInvalidPostId, loadPost]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/blog/admin/update", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          title,
          slug,
          excerpt,
          content,
          coverImageUrl,
          published,
        }),
      });

      if (redirectIfUnauthorized(response)) {
        return;
      }

      const result = await readJsonResponse<{
        post?: {
          slug: string;
          published: boolean;
        };
        error?: string;
      }>(response);

      if (!response.ok) {
        setError(result.error ?? copy.failedToUpdatePost);
        return;
      }

      router.refresh();

      if (result.post?.published) {
        router.push(`/blog/${result.post.slug}`);
      } else {
        router.push("/blog/admin");
      }
    } catch {
      setError(copy.failedToUpdatePostUnexpected);
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
              href: "/blog/admin",
              label: copy.backToBlogAdmin,
              muted: true,
            },
          ]}
        />

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            {copy.adminName}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {copy.editTitle}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {copy.editDescription}
          </p>
        </div>

        {isInvalidPostId ? (
          <section className="mt-10 rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-red-200">
            {copy.invalidPostId}
          </section>
        ) : isLoadingPost ? (
          <section className="mt-10 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-8 text-[#eaf8ff]">
            {copy.loadingPost}
          </section>
        ) : post ? (
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur"
          >
            <div className="rounded-2xl border border-[#caf0f8]/30 bg-[#caf0f8]/10 px-4 py-3 text-sm text-[#caf0f8]">
              {copy.editingPostPrefix} #{post.id}. {copy.lastUpdatedOn}{" "}
              {new Date(post.updatedAt).toLocaleDateString(dateLocale)}.
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
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={copy.titlePlaceholder}
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.slug}
              </label>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder={copy.slugPlaceholder}
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
              <p className="mt-2 text-xs text-[#caf0f8]/65">
                {copy.slugEditHelp}
              </p>
            </div>

            <div>
              <label
                htmlFor="excerpt"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.excerpt}
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder={copy.excerptPlaceholder}
                className="mt-2 w-full resize-none rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm leading-6 text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="coverImageUrl"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.coverImageUrl}
              </label>
              <input
                id="coverImageUrl"
                type="text"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                placeholder={copy.coverImageUrlPlaceholder}
                className="mt-2 w-full rounded-2xl border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-semibold text-[#f8fcff]"
              >
                {copy.content}
              </label>
              <textarea
                id="content"
                rows={12}
                required
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={copy.contentPlaceholder}
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
              {copy.publishThisPost}
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
              {isSubmitting ? copy.saving : copy.saveChanges}
            </button>
          </form>
        ) : (
          <section className="mt-10 rounded-3xl border border-red-500/40 bg-red-500/10 p-8 text-red-200">
            {copy.postCouldNotLoad}
          </section>
        )}
      </div>
    </main>
  );
}
