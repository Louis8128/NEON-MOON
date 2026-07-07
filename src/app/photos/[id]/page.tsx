import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhotoDetailContent, {
  type PhotoDetailItem,
} from "@/components/PhotoDetailContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PhotoDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function parsePhotoId(id: string) {
  const photoId = Number(id);

  if (!Number.isInteger(photoId) || photoId <= 0) {
    notFound();
  }

  return photoId;
}

export async function generateMetadata({
  params,
}: PhotoDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const photoId = Number(id);

  if (!Number.isInteger(photoId) || photoId <= 0) {
    return {
      title: "Photos",
      description: "Photos from NEON MOON.",
      alternates: {
        canonical: "/photos",
      },
    };
  }

  const photo = await prisma.photo.findUnique({
    where: {
      id: photoId,
    },
    select: {
      title: true,
      location: true,
      description: true,
    },
  });

  if (!photo) {
    return {
      title: "Photos",
      description: "Photos from NEON MOON.",
      alternates: {
        canonical: "/photos",
      },
    };
  }

  return {
    title: photo.title,
    description:
      photo.description ??
      (photo.location ? `A photo from ${photo.location}.` : "A photo from NEON MOON."),
    alternates: {
      canonical: `/photos/${id}`,
    },
  };
}

export default async function PhotoDetailPage({
  params,
}: PhotoDetailPageProps) {
  // Read the dynamic route parameter from the URL.
  // Example: /photos/3 gives id = "3".
  // 动态路由参数，读取照片 id。
  const { id } = await params;
  const photoId = parsePhotoId(id);

  // Find one photo record by its primary key.
  // 用数据库主键 id 查询单张照片。
  const photo = await prisma.photo.findUnique({
    where: {
      id: photoId,
    },
  });

  if (!photo) {
    notFound();
  }

  const serializedPhoto: PhotoDetailItem = {
    title: photo.title,
    imageUrl: photo.imageUrl,
    location: photo.location,
    description: photo.description,
    takenAt: photo.takenAt?.toISOString() ?? null,
  };

  return <PhotoDetailContent photo={serializedPhoto} />;
}
