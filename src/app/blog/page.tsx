import type { Metadata } from "next";
import BlogListContent, {
  type BlogListPost,
} from "@/components/BlogListContent";
import { blogPostCardSelect, serializeBlogPostCard } from "@/lib/blogPublic";
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
    select: blogPostCardSelect,
  });

  const serializedPosts: BlogListPost[] = posts.map(serializeBlogPostCard);

  return <BlogListContent posts={serializedPosts} />;
}
