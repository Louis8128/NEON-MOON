import type { Metadata } from "next";
import BlogArchiveContent from "@/components/BlogArchiveContent";
import { blogPostCardSelect, serializeBlogPostCard } from "@/lib/blogPublic";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Archives",
  description: "Published posts organized by time.",
  alternates: {
    canonical: "/blog/archive",
  },
};

export default async function BlogArchivePage() {
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: blogPostCardSelect,
  });

  return <BlogArchiveContent posts={posts.map(serializeBlogPostCard)} />;
}
