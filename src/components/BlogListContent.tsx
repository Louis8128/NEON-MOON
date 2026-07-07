"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import { type BlogPostCard } from "@/lib/blogTypes";

export type BlogListPost = BlogPostCard;

function formatDate(dateValue: string, locale: string) {
  return new Date(dateValue).toLocaleDateString(locale);
}

export default function BlogListContent({ posts }: { posts: BlogListPost[] }) {
  const { locale, t } = useI18n();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-AU";

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#caf0f8]">
            {t.blog.eyebrow}
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight">
            {t.blog.title}
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {t.blog.description}
          </p>
        </div>

        {posts.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              {t.blog.noPostsYet}
            </p>
            <p className="mt-2 text-sm text-[#caf0f8]/80">
              {t.blog.noPostsDescription}
            </p>
          </section>
        ) : (
          <section className="space-y-6" aria-label={t.blog.latestPosts}>
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-full border border-[#caf0f8]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]">
                    {t.blog.published}
                  </span>

                  <span className="text-xs text-[#caf0f8]/65">
                    {t.blog.postedOn} {formatDate(post.createdAt, dateLocale)}
                  </span>
                </div>

                {(post.category || post.tags.length > 0) && (
                  <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-[#caf0f8]">
                    {post.category && (
                      <Link
                        href={`/blog/categories/${post.category.slug}`}
                        className="rounded-full border border-[#caf0f8]/35 px-3 py-1 transition hover:bg-[#caf0f8] hover:text-[#023e8a]"
                      >
                        {t.blog.category}: {post.category.name}
                      </Link>
                    )}

                    {post.tags.slice(0, 4).map((tag) => (
                      <Link
                        key={tag.slug}
                        href={`/blog/tags/${tag.slug}`}
                        className="rounded-full border border-[#caf0f8]/25 px-3 py-1 text-[#eaf8ff] transition hover:bg-[#caf0f8] hover:text-[#023e8a]"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                <h2 className="text-2xl font-bold text-white">{post.title}</h2>

                {post.excerpt && (
                  <p className="mt-3 text-sm leading-6 text-[#eaf8ff]">
                    {post.excerpt}
                  </p>
                )}

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-[#caf0f8] transition hover:text-white"
                >
                  {t.blog.readMore} →
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
