import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const [mediaItems, blogPosts, photos] = query
    ? await Promise.all([
        prisma.mediaItem.findMany({
          where: {
            OR: [
              { title: { contains: query } },
              { creator: { contains: query } },
              { note: { contains: query } },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.blogPost.findMany({
          where: {
            published: true,
            OR: [
              { title: { contains: query } },
              { excerpt: { contains: query } },
              { content: { contains: query } },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.photo.findMany({
          where: {
            OR: [
              { title: { contains: query } },
              { location: { contains: query } },
              { description: { contains: query } },
            ],
          },
          orderBy: {
            takenAt: "desc",
          },
        }),
      ])
    : [[], [], []];

  const totalResults = mediaItems.length + blogPosts.length + photos.length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Search"
          title="Search NEON MOON"
          description="Search across media notes, blog posts, and photo records."
        />

        <form action="/search" className="mb-10 flex max-w-2xl gap-3">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search for music, posts, photos..."
            className="min-w-0 flex-1 rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400"
          />
          <button
            type="submit"
            className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Search
          </button>
        </form>

        {!query ? (
          <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
            <p className="text-lg font-semibold text-slate-200">
              Enter a keyword to search.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Try words like moon, Tokyo, music, website, or Interstellar.
            </p>
          </section>
        ) : totalResults === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
            <p className="text-lg font-semibold text-slate-200">
              No results found for “{query}”.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Try another keyword or add more records to the database.
            </p>
          </section>
        ) : (
          <div className="space-y-12">
            <p className="text-sm text-slate-400">
              Found {totalResults} result{totalResults === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-cyan-300">“{query}”</span>.
            </p>

            {mediaItems.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">Media</h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mediaItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/media?category=${item.category}`}
                      className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-400/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        {item.category}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {item.title}
                      </h3>
                      {item.creator && (
                        <p className="mt-2 text-sm text-slate-400">
                          {item.creator}
                        </p>
                      )}
                      {item.note && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                          {item.note}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {blogPosts.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">Blog</h2>

                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block rounded-3xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-400/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        Blog Post
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {post.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {photos.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">Photos</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {photos.map((photo) => (
                    <Link
                      key={photo.id}
                      href="/photos"
                      className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-400/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        Photo
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {photo.title}
                      </h3>
                      {photo.location && (
                        <p className="mt-2 text-sm text-slate-400">
                          {photo.location}
                        </p>
                      )}
                      {photo.description && (
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {photo.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
