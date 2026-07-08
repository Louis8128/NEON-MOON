"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import { type BlogPostCard } from "@/lib/blogTypes";

export default function BlogArchiveContent({
  posts,
}: {
  posts: BlogPostCard[];
}) {
  const { locale, t } = useI18n();
  const dateLocale = locale === "zh" ? "zh-CN" : "en-AU";
  const groupedPosts = posts.reduce(
    (groups, post) => {
      const date = new Date(post.createdAt);
      const year = String(date.getFullYear());
      const monthKey = String(date.getMonth());

      groups[year] ??= {};
      groups[year][monthKey] ??= [];
      groups[year][monthKey].push(post);

      return groups;
    },
    {} as Record<string, Record<string, BlogPostCard[]>>,
  );

  const years = Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(202,240,248,0.16),transparent_32%),linear-gradient(180deg,#0077b6_0%,#005f8f_46%,#003b73_100%)] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#caf0f8]">
            {t.blog.eyebrow}
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight">
            {t.blog.archives}
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {t.blog.archiveDescription}
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
          <div className="space-y-8">
            {years.map((year) => {
              const months = Object.keys(groupedPosts[year]).sort(
                (a, b) => Number(b) - Number(a),
              );

              return (
                <section
                  key={year}
                  className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20"
                >
                  <h2 className="text-3xl font-bold text-white">{year}</h2>

                  <div className="mt-6 space-y-6">
                    {months.map((monthKey) => {
                      const date = new Date(Number(year), Number(monthKey), 1);
                      const monthLabel = date.toLocaleDateString(dateLocale, {
                        month: "long",
                      });

                      return (
                        <div key={monthKey}>
                          <h3 className="text-lg font-semibold text-[#caf0f8]">
                            {monthLabel}
                          </h3>

                          <div className="mt-3 space-y-3">
                            {groupedPosts[year][monthKey].map((post) => (
                              <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="flex flex-col rounded-2xl border border-[#caf0f8]/20 bg-[#03045e]/30 px-4 py-3 transition hover:border-[#caf0f8]/60 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <span className="font-semibold text-white">
                                  {post.title}
                                </span>
                                <span className="mt-1 text-xs text-[#caf0f8]/65 sm:mt-0">
                                  {new Date(post.createdAt).toLocaleDateString(
                                    dateLocale,
                                  )}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
