import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
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
            {photos.map((photo) => (
              <article
                key={photo.id}
                className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
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
