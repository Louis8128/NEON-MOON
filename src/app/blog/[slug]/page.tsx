import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to Blog
        </Link>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
            Blog Post
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Published on {post.createdAt.toLocaleDateString("en-AU")}
          </p>

          {post.excerpt && (
            <p className="mt-8 text-xl leading-8 text-slate-300">
              {post.excerpt}
            </p>
          )}

          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-lg shadow-black/20">
            <p className="whitespace-pre-line text-base leading-8 text-slate-200">
              {post.content}
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
