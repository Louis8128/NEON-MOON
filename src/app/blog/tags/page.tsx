import type { Metadata } from "next";
import BlogTaxonomyIndexContent, {
  type BlogTaxonomyIndexItem,
} from "@/components/BlogTaxonomyIndexContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tags",
  description: "Small threads that connect NEON MOON notes over time.",
  alternates: {
    canonical: "/blog/tags",
  },
};

export default async function BlogTagsPage() {
  const tags = await prisma.blogTag.findMany({
    where: {
      posts: {
        some: {
          post: {
            published: true,
          },
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

  const items: BlogTaxonomyIndexItem[] = tags.map((tag) => ({
    name: tag.name,
    slug: tag.slug,
    count: tag.posts.length,
  }));

  return <BlogTaxonomyIndexContent type="tags" items={items} />;
}
