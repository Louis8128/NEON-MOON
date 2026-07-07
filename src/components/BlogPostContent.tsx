"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import {
  type BlogCategorySummary,
  type BlogTagSummary,
} from "@/lib/blogTypes";

export type BlogPostDetail = {
  title: string;
  excerpt: string | null;
  content: string;
  category: BlogCategorySummary | null;
  tags: BlogTagSummary[];
  createdAt: string;
  updatedAt: string;
};

function formatDate(dateValue: string, locale: string) {
  return new Date(dateValue).toLocaleDateString(locale);
}

export default function BlogPostContent({ post }: { post: BlogPostDetail }) {
  const { locale, t } = useI18n();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-AU";

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm font-semibold text-[#caf0f8] transition hover:text-white"
        >
          {t.blog.backToBlog}
        </Link>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            {t.blog.blogPost}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#caf0f8]/65">
            <p>
              {t.blog.postedOn} {formatDate(post.createdAt, dateLocale)}
            </p>
            <p>
              {t.blog.updatedOn} {formatDate(post.updatedAt, dateLocale)}
            </p>
          </div>

          {(post.category || post.tags.length > 0) && (
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[#caf0f8]">
              {post.category && (
                <Link
                  href={`/blog/categories/${post.category.slug}`}
                  className="rounded-full border border-[#caf0f8]/35 px-3 py-1 transition hover:bg-[#caf0f8] hover:text-[#023e8a]"
                >
                  {t.blog.category}: {post.category.name}
                </Link>
              )}

              {post.tags.map((tag) => (
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

          {post.excerpt && (
            <p className="mt-8 text-xl leading-8 text-[#eaf8ff]">
              {post.excerpt}
            </p>
          )}

          <div className="mt-10 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-8 shadow-lg shadow-[#03045e]/20 backdrop-blur">
            <p className="whitespace-pre-line text-base leading-8 text-[#f8fcff]">
              {post.content}
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
