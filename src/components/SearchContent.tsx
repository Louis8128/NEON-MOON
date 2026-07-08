"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import { type MediaCategory } from "@/components/MediaListContent";
import {
  type BlogCategorySummary,
  type BlogTagSummary,
} from "@/lib/blogTypes";

export type SearchMediaItem = {
  id: number;
  title: string;
  category: MediaCategory;
  creator: string | null;
  note: string | null;
};

export type SearchBlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: BlogCategorySummary | null;
  tags: BlogTagSummary[];
};

export type SearchPhoto = {
  id: number;
  title: string;
  location: string | null;
  description: string | null;
};

type SearchContentProps = {
  query: string;
  mediaItems: SearchMediaItem[];
  blogPosts: SearchBlogPost[];
  photos: SearchPhoto[];
};

function getResultSummary(
  totalResults: number,
  query: string,
  locale: "en" | "zh",
  t: ReturnType<typeof useI18n>["t"],
) {
  if (locale === "zh") {
    return `${t.search.resultsForPrefix} ${totalResults} ${t.search.result}${totalResults === 1 ? "" : ""}，${t.search.resultsForSuffix} “${query}”。`;
  }

  return `${t.search.resultsForPrefix} ${totalResults} ${t.search.result}${totalResults === 1 ? "" : "s"} ${t.search.resultsForSuffix} “${query}”.`;
}

function getNoResultsMessage(query: string, locale: "en" | "zh", label: string) {
  if (locale === "zh") {
    return `${label}：“${query}”。`;
  }

  return `${label}: “${query}”.`;
}

export default function SearchContent({
  query,
  mediaItems,
  blogPosts,
  photos,
}: SearchContentProps) {
  const { locale, t } = useI18n();
  const totalResults = mediaItems.length + blogPosts.length + photos.length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(202,240,248,0.16),transparent_32%),linear-gradient(180deg,#0077b6_0%,#005f8f_46%,#003b73_100%)] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#caf0f8]">
            {t.search.eyebrow}
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight">
            {t.search.title}
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {t.search.description}
          </p>
        </div>

        <form action="/search" className="mb-10 flex max-w-2xl gap-3">
          <label className="sr-only" htmlFor="search-query">
            {t.search.queryLabel}
          </label>
          <input
            id="search-query"
            type="search"
            name="q"
            defaultValue={query}
            placeholder={t.search.placeholder}
            className="min-w-0 flex-1 rounded-full border border-[#caf0f8]/30 bg-[#023e8a]/45 px-5 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
          />
          <button
            type="submit"
            className="rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
          >
            {t.search.button}
          </button>
        </form>

        {!query ? (
          <section className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              {t.search.noQueryTitle}
            </p>
            <p className="mt-2 text-sm text-[#caf0f8]/80">
              {t.search.noQueryDescription}
            </p>
          </section>
        ) : totalResults === 0 ? (
          <section className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              {getNoResultsMessage(query, locale, t.search.noResultsFound)}
            </p>
            <p className="mt-2 text-sm text-[#caf0f8]/80">
              {t.search.tryAnotherKeyword}
            </p>
          </section>
        ) : (
          <div className="space-y-12">
            <p className="text-sm text-[#caf0f8]/80">
              {getResultSummary(totalResults, query, locale, t)}
            </p>

            {mediaItems.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">
                  {t.search.mediaItems}
                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mediaItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/media/${item.id}`}
                      className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-5 transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]">
                        {t.search.mediaItem}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {item.title}
                      </h3>
                      {item.creator && (
                        <p className="mt-2 text-sm text-[#caf0f8]/80">
                          {item.creator}
                        </p>
                      )}
                      {item.note && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#eaf8ff]">
                          {item.note}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {blogPosts.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">
                  {t.search.blogPosts}
                </h2>

                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-5 transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]">
                        {t.search.blogPost}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-3 text-sm leading-6 text-[#eaf8ff]">
                          {post.excerpt}
                        </p>
                      )}
                      {(post.category || post.tags.length > 0) && (
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#caf0f8]">
                          {post.category && (
                            <span className="rounded-full border border-[#caf0f8]/30 px-3 py-1">
                              {post.category.name}
                            </span>
                          )}
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.slug}
                              className="rounded-full border border-[#caf0f8]/20 px-3 py-1 text-[#eaf8ff]"
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {photos.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">
                  {t.search.photos}
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {photos.map((photo) => (
                    <Link
                      key={photo.id}
                      href={`/photos/${photo.id}`}
                      className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-5 transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]">
                        {t.search.photo}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {photo.title}
                      </h3>
                      {photo.location && (
                        <p className="mt-2 text-sm text-[#caf0f8]/80">
                          {photo.location}
                        </p>
                      )}
                      {photo.description && (
                        <p className="mt-3 text-sm leading-6 text-[#eaf8ff]">
                          {photo.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
