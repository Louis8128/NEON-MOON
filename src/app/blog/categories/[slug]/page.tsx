import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogTaxonomyDetailContent from "@/components/BlogTaxonomyDetailContent";
import { blogPostCardSelect, serializeBlogPostCard } from "@/lib/blogPublic";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type BlogCategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.blogCategory.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      posts: {
        where: {
          published: true,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!category || category.posts.length === 0) {
    return {
      title: "Categories",
      description: "Themes that collect related NEON MOON writing.",
      alternates: {
        canonical: "/blog/categories",
      },
    };
  }

  return {
    title: category.name,
    description: `NEON MOON writing collected under ${category.name}.`,
    alternates: {
      canonical: `/blog/categories/${slug}`,
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageProps) {
  const { slug } = await params;
  const category = await prisma.blogCategory.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      posts: {
        where: {
          published: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: blogPostCardSelect,
      },
    },
  });

  if (!category || category.posts.length === 0) {
    notFound();
  }

  return (
    <BlogTaxonomyDetailContent
      type="category"
      name={category.name}
      posts={category.posts.map(serializeBlogPostCard)}
    />
  );
}
