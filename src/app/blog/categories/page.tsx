import type { Metadata } from "next";
import BlogTaxonomyIndexContent, {
  type BlogTaxonomyIndexItem,
} from "@/components/BlogTaxonomyIndexContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse posts by category.",
  alternates: {
    canonical: "/blog/categories",
  },
};

export default async function BlogCategoriesPage() {
  const categories = await prisma.blogCategory.findMany({
    where: {
      posts: {
        some: {
          published: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      name: true,
      slug: true,
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

  const items: BlogTaxonomyIndexItem[] = categories.map((category) => ({
    name: category.name,
    slug: category.slug,
    count: category.posts.length,
  }));

  return <BlogTaxonomyIndexContent type="categories" items={items} />;
}
