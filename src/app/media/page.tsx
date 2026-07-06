import MediaListContent, {
  type MediaCategory,
  type MediaFilter,
  type MediaListItem,
} from "@/components/MediaListContent";
import { prisma } from "@/lib/prisma";

type MediaPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const mediaCategories = ["MOVIE", "MUSIC", "BOOK", "ANIME", "GAME"] as const;

function isValidMediaCategory(category: unknown): category is MediaCategory {
  return (
    typeof category === "string" &&
    mediaCategories.includes(category as MediaCategory)
  );
}

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const { category } = await searchParams;

  // Read the selected category from the URL query string.
  // 从 URL 查询参数读取当前分类筛选。
  const activeFilter: MediaFilter = isValidMediaCategory(category)
    ? category
    : "ALL";

  // Load public media items from the database.
  // 从数据库读取公开媒体收藏列表。
  const mediaItems = await prisma.mediaItem.findMany({
    where:
      activeFilter === "ALL"
        ? undefined
        : {
            category: activeFilter,
          },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      category: true,
      creator: true,
      releaseYear: true,
      coverUrl: true,
      rating: true,
      note: true,
      updatedAt: true,
    },
  });

  const serializedMediaItems: MediaListItem[] = mediaItems.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category as MediaCategory,
    creator: item.creator,
    releaseYear: item.releaseYear,
    coverUrl: item.coverUrl,
    rating: item.rating,
    note: item.note,
  }));

  return (
    <MediaListContent
      activeFilter={activeFilter}
      mediaItems={serializedMediaItems}
    />
  );
}
