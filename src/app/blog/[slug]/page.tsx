import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostContent, {
  type BlogPostDetail,
} from "@/components/BlogPostContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      excerpt: true,
      published: true,
    },
  });

  if (!post || !post.published) {
    return {
      title: "Blog",
      description: "Writing and notes from NEON MOON.",
      alternates: {
        canonical: "/blog",
      },
    };
  }

  return {
    title: post.title,
    description: post.excerpt ?? "A blog post from NEON MOON.",
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

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
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  // Do not show missing or unpublished posts to public visitors.
  // notFound() renders Next.js's 404 page.
  // 文章不存在或未发布时显示 404。
  if (!post || !post.published) {
    notFound();
  }

  const serializedPost: BlogPostDetail = {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: post.tags.map((item) => item.tag),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  return <BlogPostContent post={serializedPost} />;
}
