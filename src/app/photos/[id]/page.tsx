import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/photos"
          className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to Gallery
        </Link>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
            Photo Detail
          </p>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20">
            <div className="relative h-[70vh] min-h-[360px] w-full bg-slate-900">
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  {photo.title}
                </h1>

                {photo.location && (
                  <p className="mt-3 text-sm font-medium text-slate-400">
                    Location: {photo.location}
                  </p>
                )}
              </div>

              {photo.takenAt && (
                <span className="rounded-full border border-cyan-400/40 px-4 py-2 text-xs font-semibold text-cyan-300">
                  {photo.takenAt.toLocaleDateString("en-AU")}
                </span>
              )}
            </div>

            {photo.description && (
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
                {photo.description}
              </p>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
