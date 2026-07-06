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

export default async function PhotoDetailPage({
  params,
}: PhotoDetailPageProps) {
  // Read the dynamic route parameter from the URL.
  // Example: /photos/3 gives id = "3".
  // 动态路由参数，读取照片 id。
  const { id } = await params;
  const photoId = Number(id);

  // If the URL id is not a valid number, show 404.
  // 无效 id 直接显示 404。
  if (Number.isNaN(photoId)) {
    notFound();
  }

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
