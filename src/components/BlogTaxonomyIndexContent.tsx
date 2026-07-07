"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export type BlogTaxonomyIndexItem = {
  name: string;
  slug: string;
  count: number;
};

export default function BlogTaxonomyIndexContent({
  type,
  items,
}: {
  type: "categories" | "tags";
  items: BlogTaxonomyIndexItem[];
}) {
  const { locale, t } = useI18n();
  const isCategories = type === "categories";
  const title = isCategories ? t.blog.categories : t.blog.tags;
  const description = isCategories
    ? t.blog.categoriesDescription
    : t.blog.tagsDescription;
  const basePath = isCategories ? "/blog/categories" : "/blog/tags";

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#caf0f8]">
            {t.blog.eyebrow}
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight">{title}</h1>

          <p className="max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {description}
          </p>
        </div>

        {items.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              {t.blog.noPostsYet}
            </p>
            <p className="mt-2 text-sm text-[#caf0f8]/80">
              {t.blog.noPostsDescription}
            </p>
          </section>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`${basePath}/${item.slug}`}
                className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#caf0f8]">
                  {isCategories ? t.blog.category : t.blog.tags}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white">
                  {item.name}
                </h2>
                <p className="mt-3 text-sm text-[#caf0f8]/80">
                  {locale === "zh"
                    ? `${item.count} ${t.blog.post}`
                    : `${item.count} ${
                        item.count === 1 ? t.blog.post : t.blog.posts
                      }`}
                </p>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
