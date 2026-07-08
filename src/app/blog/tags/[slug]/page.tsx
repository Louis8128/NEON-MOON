import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogTaxonomyDetailContent from "@/components/BlogTaxonomyDetailContent";
import { blogPostCardSelect, serializeBlogPostCard } from "@/lib/blogPublic";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type BlogTagPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogTagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.blogTag.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      posts: {
        where: {
          post: {
            published: true,
          },
        },
        select: {
          postId: true,
        },
      },
    },
  });

  if (!tag || tag.posts.length === 0) {
    return {
      title: "Tags",
      description: "Small threads that connect NEON MOON notes over time.",
      alternates: {
        canonical: "/blog/tags",
      },
    };
  }

  return {
    title: tag.name,
    description: `NEON MOON notes connected by ${tag.name}.`,
    alternates: {
      canonical: `/blog/tags/${slug}`,
    },
  };
}

export default async function BlogTagPage({ params }: BlogTagPageProps) {
  const { slug } = await params;
  const tag = await prisma.blogTag.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      posts: {
        where: {
          post: {
            published: true,
          },
        },
        select: {
          post: {
            select: blogPostCardSelect,
          },
        },
      },
    },
  });

  if (!tag || tag.posts.length === 0) {
    notFound();
  }

  const posts = tag.posts
    .map((item) => item.post)
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
    .map(serializeBlogPostCard);

  return <BlogTaxonomyDetailContent type="tag" name={tag.name} posts={posts} />;
}
