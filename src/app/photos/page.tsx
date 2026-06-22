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
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Photos"
          title="Visual notes from places, days, and small moments"
          description="A personal photo archive loaded from the MySQL database through Prisma."
        />

        {photos.length === 0 ? (
          // Empty state shown when the Photo table has no records.
          // 数据库没有照片记录时显示空状态。
          <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
            <p className="text-lg font-semibold text-slate-200">
              No photos yet.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Add photo records to the database and they will appear here.
            </p>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {/* Each Photo database record becomes one photo card. */}
            {/* 数据库照片记录 map 成照片卡片。 */}
            {photos.map((photo) => (
              <article
                key={photo.id}
                className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
                {/* Temporary visual placeholder.
                    Later, this can be replaced with Next.js <Image /> once real image files exist in public/photos. */}
                {/* 临时图片占位区，之后可替换成真实图片。 */}
                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-cyan-950">
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
                      Photo
                    </p>
                    <p className="mt-3 text-3xl font-bold text-white">
                      {photo.title}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold text-white">
                      {photo.title}
                    </h2>

                    {photo.takenAt && (
                      <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {photo.takenAt.toLocaleDateString("en-AU")}
                      </span>
                    )}
                  </div>

                  {photo.location && (
                    <p className="text-sm font-medium text-slate-400">
                      Location: {photo.location}
                    </p>
                  )}

                  {photo.description && (
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      {photo.description}
                    </p>
                  )}

                  {/* Keep the image path visible during development for debugging. */}
                  {/* 开发阶段显示图片路径，方便之后接入真实图片。 */}
                  <p className="mt-4 text-xs text-slate-600">
                    Image path: {photo.imageUrl}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
