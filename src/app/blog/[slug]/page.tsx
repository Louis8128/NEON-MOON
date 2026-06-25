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
  // Read the dynamic route parameter from the URL.
  // Example: /blog/building-neon-moon gives slug = "building-neon-moon".
  // 动态路由参数，读取 URL 中的 slug。
  const { slug } = await params;

  // Find one blog post by its unique slug.
  // The slug field is marked as @unique in schema.prisma, so it can identify one post.
  // 用 slug 查询唯一文章。
  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
    },
  });

  // Do not show missing or unpublished posts to public visitors.
  // notFound() renders Next.js's 404 page.
  // 文章不存在或未发布时显示 404。
  if (!post || !post.published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="text-sm font-semibold text-[#caf0f8] transition hover:text-white"
        >
          ← Back to Blog
        </Link>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Blog Post
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-sm text-[#caf0f8]/65">
            Published on {post.createdAt.toLocaleDateString("en-AU")}
          </p>

          {post.excerpt && (
            <p className="mt-8 text-xl leading-8 text-[#eaf8ff]">
              {post.excerpt}
            </p>
          )}

          <div className="mt-10 rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-8 shadow-lg shadow-[#03045e]/20 backdrop-blur">
            {/* Preserve line breaks from the plain text content stored in the database. */}
            {/* 保留数据库文章内容里的换行。 */}
            <p className="whitespace-pre-line text-base leading-8 text-[#f8fcff]">
              {post.content}
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
