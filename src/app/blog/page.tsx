export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
          Blog
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight">
          My Blog
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-8 text-slate-300">
          This page will be used to publish my technical notes, project logs,
          life reflections, and long-form articles.
        </p>

        <div className="space-y-4">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-500">Coming soon</p>
            <h2 className="text-2xl font-semibold">
              Building My Personal Full-Stack Website
            </h2>
            <p className="mt-3 text-slate-400">
              A development journal about learning Next.js, MySQL, Prisma,
              Linux deployment, and Raspberry Pi hosting from scratch.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="mb-2 text-sm text-slate-500">Coming soon</p>
            <h2 className="text-2xl font-semibold">
              Notes on Music, Books, and Daily Life
            </h2>
            <p className="mt-3 text-slate-400">
              Personal essays and short reflections about the things I read,
              watch, listen to, and experience.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}