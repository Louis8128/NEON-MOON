import { getAbsoluteUrl, getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type RssPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
};

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case "\"":
        return "&quot;";
      default:
        return character;
    }
  });
}

async function getPublishedPosts(): Promise<RssPost[]> {
  try {
    const { prisma } = await import("@/lib/prisma");

    return await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  } catch (error) {
    console.warn("[rss] Failed to load published posts.", error);
    return [];
  }
}

function buildRssFeed(posts: RssPost[]) {
  const siteUrl = getSiteUrl();
  const feedUrl = getAbsoluteUrl("/rss.xml");
  const items = posts
    .map((post) => {
      const postUrl = getAbsoluteUrl(`/blog/${post.slug}`);
      const description = post.excerpt ?? "A blog post from NEON MOON.";

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${post.createdAt.toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`;
}

export async function GET() {
  const posts = await getPublishedPosts();

  return new Response(buildRssFeed(posts), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
