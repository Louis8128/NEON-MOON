export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
          Personal Full-Stack Website
        </p>

        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Welcome to My Life Site - Neon Moon
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-slate-300">
          This website will become my personal digital space for blogs, media
          collections, photos, music, books, movies, anime, and games.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Blog</h2>
            <p className="mt-2 text-sm text-slate-400">
              Technical notes and life reflections.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Media Library</h2>
            <p className="mt-2 text-sm text-slate-400">
              Music, books, movies, anime, and games I like.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-xl font-semibold">Photos</h2>
            <p className="mt-2 text-sm text-slate-400">
              Travel and daily-life photography.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}