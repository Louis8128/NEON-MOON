import { notFound } from "next/navigation";
import MediaDetailContent, {
  type MediaDetailItem,
} from "@/components/MediaDetailContent";
import { type MediaCategory } from "@/components/MediaListContent";
import { prisma } from "@/lib/prisma";

type MediaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getMediaItem(id: string) {
  const mediaItemId = Number(id);

  if (!Number.isInteger(mediaItemId) || mediaItemId <= 0) {
    notFound();
  }

  const mediaItem = await prisma.mediaItem.findUnique({
    where: {
      id: mediaItemId,
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
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!mediaItem) {
    notFound();
  }

  return mediaItem;
}

export default async function MediaDetailPage({
  params,
}: MediaDetailPageProps) {
  const { id } = await params;
  const mediaItem = await getMediaItem(id);

  const serializedMediaItem: MediaDetailItem = {
    id: mediaItem.id,
    title: mediaItem.title,
    category: mediaItem.category as MediaCategory,
    creator: mediaItem.creator,
    releaseYear: mediaItem.releaseYear,
    coverUrl: mediaItem.coverUrl,
    rating: mediaItem.rating,
    note: mediaItem.note,
    createdAt: mediaItem.createdAt.toISOString(),
    updatedAt: mediaItem.updatedAt.toISOString(),
  };

  return <MediaDetailContent mediaItem={serializedMediaItem} />;
}
