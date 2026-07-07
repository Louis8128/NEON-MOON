import type { Metadata } from "next";
import SearchContent, {
  type SearchBlogPost,
  type SearchMediaItem,
  type SearchPhoto,
} from "@/components/SearchContent";
import { type MediaCategory } from "@/components/MediaListContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search writing, media notes, photos, and remembered details across NEON MOON.",
  alternates: {
    canonical: "/search",
  },
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Read the global search keyword from the URL.
  // Example: /search?q=moon gives query = "moon".
  // 读取全站搜索关键词。
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  // Search across three database tables at the same time.
  // Promise.all runs the queries in parallel instead of waiting for them one by one.
  // 三表并行查询，搜索 Media / Blog / Photo。
  const [mediaItems, blogPosts, photos] = query
    ? await Promise.all([
        prisma.mediaItem.findMany({
          where: {
            OR: [
              { title: { contains: query } },
              { creator: { contains: query } },
              { note: { contains: query } },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.blogPost.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: query } },
              { excerpt: { contains: query } },
              { content: { contains: query } },
              { category: { name: { contains: query } } },
              { tags: { some: { tag: { name: { contains: query } } } } },
            ],
          },
          orderBy: {
            createdAt: "desc",
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
        }),

        prisma.photo.findMany({
          where: {
            OR: [
              { title: { contains: query } },
              { location: { contains: query } },
              { description: { contains: query } },
            ],
          },
          orderBy: {
            takenAt: "desc",
          },
        }),
      ])
    : [[], [], []];

  const serializedMediaItems: SearchMediaItem[] = mediaItems.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category as MediaCategory,
    creator: item.creator,
    note: item.note,
  }));
  const serializedBlogPosts: SearchBlogPost[] = blogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags.map((item) => item.tag),
  }));
  const serializedPhotos: SearchPhoto[] = photos.map((photo) => ({
    id: photo.id,
    title: photo.title,
    location: photo.location,
    description: photo.description,
  }));

  return (
    <SearchContent
      query={query}
      mediaItems={serializedMediaItems}
      blogPosts={serializedBlogPosts}
      photos={serializedPhotos}
    />
  );
}
