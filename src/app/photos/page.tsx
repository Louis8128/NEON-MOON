import type { Metadata } from "next";
import PhotoGalleryContent, {
  type PhotoGalleryItem,
} from "@/components/PhotoGalleryContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photos",
  description:
    "Photos from trips, ordinary days, and small moments worth keeping.",
  alternates: {
    canonical: "/photos",
  },
};

export default async function PhotosPage() {
  // Query photo records from MySQL through Prisma.
  // Photos with newer takenAt dates are shown first.
  // 读取照片表，按拍摄时间倒序排列。
  const photos = await prisma.photo.findMany({
    orderBy: {
      takenAt: "desc",
    },
  });

  const serializedPhotos: PhotoGalleryItem[] = photos.map((photo) => ({
    id: photo.id,
    title: photo.title,
    imageUrl: photo.imageUrl,
    location: photo.location,
    description: photo.description,
    takenAt: photo.takenAt?.toISOString() ?? null,
  }));

  return <PhotoGalleryContent photos={serializedPhotos} />;
}
