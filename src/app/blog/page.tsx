import type { Metadata } from "next";
import BlogListContent, {
  type BlogListPost,
} from "@/components/BlogListContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Life notes, essays, travel notes, and project updates from NEON MOON.",
  alternates: {
    canonical: "/blog",
  },
};

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

  const serializedPosts: BlogListPost[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    createdAt: post.createdAt.toISOString(),
  }));

  return <BlogListContent posts={serializedPosts} />;
}
