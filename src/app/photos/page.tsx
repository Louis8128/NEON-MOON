import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  // Query photo records from MySQL through Prisma.
  // Photos with newer takenAt dates are shown first.
  // 读取照片表，按拍摄时间倒序排列。
  const photos = await prisma.photo.findMany({
    orderBy: {
      takenAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Photos"
          title="Visual notes from places, days, and small moments"
          description="A personal photo archive loaded from the MySQL database through Prisma."
        />

        {photos.length === 0 ? (
          // Empty state shown when the Photo table has no records.
          // 数据库没有照片记录时显示空状态。
          <section className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              No photos yet.
            </p>
            <p className="mt-2 text-sm text-[#caf0f8]/80">
              Add photo records to the database and they will appear here.
            </p>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {/* Each Photo database record becomes one clickable photo card. */}
            {/* 数据库照片记录 map 成可点击照片卡片。 */}
            {photos.map((photo) => (
              <Link
                key={photo.id}
                href={`/photos/${photo.id}`}
                className="group block overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 shadow-lg shadow-[#03045e]/20 backdrop-blur transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
              >
                <article>
                  {/* Real image rendered from public/photos or public/uploads/photos through imageUrl. */}
                  {/* 真实图片展示：数据库 imageUrl 对应 public/photos 或 public/uploads/photos。 */}
                  <div className="relative h-64 w-full overflow-hidden bg-[#023e8a]/75">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-2xl font-bold text-white">
                        {photo.title}
                      </h2>

                      {photo.takenAt && (
                        <span className="rounded-full border border-[#caf0f8]/40 px-3 py-1 text-xs font-semibold text-[#caf0f8]">
                          {photo.takenAt.toLocaleDateString("en-AU")}
                        </span>
                      )}
                    </div>

                    {photo.location && (
                      <p className="text-sm font-medium text-[#caf0f8]/80">
                        Location: {photo.location}
                      </p>
                    )}

                    {photo.description && (
                      <p className="mt-4 text-sm leading-6 text-[#eaf8ff]">
                        {photo.description}
                      </p>
                    )}

                    <p className="mt-5 text-sm font-semibold text-[#caf0f8] transition group-hover:text-[#caf0f8]">
                      View details →
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
