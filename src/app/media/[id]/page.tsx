import type { Metadata } from "next";
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

function parseMediaItemId(id: string) {
  const mediaItemId = Number(id);

  if (!Number.isInteger(mediaItemId) || mediaItemId <= 0) {
    notFound();
  }

  return mediaItemId;
}

async function getMediaItem(id: string) {
  const mediaItemId = parseMediaItemId(id);

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
    },
  });

  if (!mediaItem) {
    notFound();
  }

  return mediaItem;
}

export async function generateMetadata({
  params,
}: MediaDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const mediaItemId = Number(id);

  if (!Number.isInteger(mediaItemId) || mediaItemId <= 0) {
    return {
      title: "Media | NEON MOON",
      description: "Media notes from NEON MOON.",
    };
  }

  const mediaItem = await prisma.mediaItem.findUnique({
    where: {
      id: mediaItemId,
    },
    select: {
      title: true,
      note: true,
    },
  });

  if (!mediaItem) {
    return {
      title: "Media | NEON MOON",
      description: "Media notes from NEON MOON.",
    };
  }

  return {
    title: `${mediaItem.title} | NEON MOON`,
    description: mediaItem.note ?? "A media note from NEON MOON.",
  };
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
  };

  return <MediaDetailContent mediaItem={serializedMediaItem} />;
}
