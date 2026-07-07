import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/site";

export const revalidate = 3600;

function getStaticRoutes(now: Date): MetadataRoute.Sitemap {
  return [
    {
      url: getAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: getAbsoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl("/blog/archive"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: getAbsoluteUrl("/blog/categories"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: getAbsoluteUrl("/blog/tags"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: getAbsoluteUrl("/media"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl("/photos"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl("/search"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: getAbsoluteUrl("/rss.xml"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = getStaticRoutes(now);

  try {
    const { prisma } = await import("@/lib/prisma");

    const [blogPosts, blogCategories, blogTags, mediaItems, photos] =
      await Promise.all([
        prisma.blogPost.findMany({
          where: {
            published: true,
          },
          select: {
            slug: true,
            updatedAt: true,
            createdAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.blogCategory.findMany({
          where: {
            posts: {
              some: {
                published: true,
              },
            },
          },
          select: {
            slug: true,
            updatedAt: true,
            createdAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.blogTag.findMany({
          where: {
            posts: {
              some: {
                post: {
                  published: true,
                },
              },
            },
          },
          select: {
            slug: true,
            updatedAt: true,
            createdAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.mediaItem.findMany({
          select: {
            id: true,
            updatedAt: true,
            createdAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.photo.findMany({
          select: {
            id: true,
            updatedAt: true,
            createdAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
      ]);

    return [
      ...staticRoutes,
      ...blogPosts.map((post) => ({
        url: getAbsoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt ?? post.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...blogCategories.map((category) => ({
        url: getAbsoluteUrl(`/blog/categories/${category.slug}`),
        lastModified: category.updatedAt ?? category.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      ...blogTags.map((tag) => ({
        url: getAbsoluteUrl(`/blog/tags/${tag.slug}`),
        lastModified: tag.updatedAt ?? tag.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      ...mediaItems.map((item) => ({
        url: getAbsoluteUrl(`/media/${item.id}`),
        lastModified: item.updatedAt ?? item.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...photos.map((photo) => ({
        url: getAbsoluteUrl(`/photos/${photo.id}`),
        lastModified: photo.updatedAt ?? photo.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch (error) {
    console.warn("[sitemap] Failed to load dynamic routes.", error);
    return staticRoutes;
  }
}
