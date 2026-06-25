import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  // Query only published blog posts for the public blog page.
  // Newer posts are shown first.
  // 只显示已发布文章，按创建时间倒序排列。
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          eyebrow="Blog"
          title="Notes, essays, and development logs"
          description="A personal writing space for technical notes, reflections, music thoughts, and project updates."
        />

        {posts.length === 0 ? (
          // Empty state shown when there are no published posts in the database.
          // 数据库没有已发布文章时显示空状态。
          <section className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              No blog posts yet.
            </p>
            <p className="mt-2 text-sm text-[#caf0f8]/80">
              Add posts to the database and they will appear here.
            </p>
          </section>
        ) : (
          <section className="space-y-6">
            {/* Each BlogPost database record becomes one blog preview card. */}
            {/* 数据库文章记录 map 成博客预览卡片。 */}
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-full border border-[#caf0f8]/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]">
                    Published
                  </span>

                  <span className="text-xs text-[#caf0f8]/65">
                    {post.createdAt.toLocaleDateString("en-AU")}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white">{post.title}</h2>

                {post.excerpt && (
                  <p className="mt-3 text-sm leading-6 text-[#eaf8ff]">
                    {post.excerpt}
                  </p>
                )}

                {/* Link to the dynamic blog detail route: /blog/[slug]. */}
                {/* 用 slug 跳转到博客详情页。 */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-[#caf0f8] transition hover:text-white"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
