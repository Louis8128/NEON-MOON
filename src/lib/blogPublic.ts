import { type Prisma } from "@prisma/client";
import { type BlogPostCard } from "@/lib/blogTypes";

export const blogPostCardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  createdAt: true,
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
} as const;

export type BlogPostCardRecord = Prisma.BlogPostGetPayload<{
  select: typeof blogPostCardSelect;
}>;

export function serializeBlogPostCard(
  post: BlogPostCardRecord,
): BlogPostCard {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    createdAt: post.createdAt.toISOString(),
    category: post.category,
    tags: post.tags.map((item) => item.tag),
  };
}
