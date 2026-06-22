import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          eyebrow="Blog"
          title="Notes, essays, and development logs"
          description="A personal writing space for technical notes, reflections, music thoughts, and project updates."
        />

        {posts.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
            <p className="text-lg font-semibold text-slate-200">
              No blog posts yet.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Add posts to the database and they will appear here.
            </p>
          </section>
        ) : (
          <section className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Published
                  </span>

                  <span className="text-xs text-slate-500">
                    {post.createdAt.toLocaleDateString("en-AU")}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white">{post.title}</h2>

                {post.excerpt && (
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {post.excerpt}
                  </p>
                )}

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
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
