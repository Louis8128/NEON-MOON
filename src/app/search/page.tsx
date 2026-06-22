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
  // Read the global search keyword from the URL.
  // Example: /search?q=moon gives query = "moon".
  // 读取全站搜索关键词。
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  // Search across three database tables at the same time.
  // Promise.all runs the queries in parallel instead of waiting for them one by one.
  // 三表并行查询，搜索 Media / Blog / Photo。
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

  // Total number of results across all searched content types.
  // 汇总全站搜索结果数量。
  const totalResults = mediaItems.length + blogPosts.length + photos.length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Search"
          title="Search NEON MOON"
          description="Search across media notes, blog posts, and photo records."
        />

        {/* Search form on the search page itself, keeping the current query as defaultValue. */}
        {/* 搜索页内搜索框，保留当前关键词。 */}
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

        {/* State 1: no query has been entered yet. */}
        {/* 还没有输入搜索词。 */}
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
          // State 2: query exists, but no database records matched it.
          // 有搜索词，但没有结果。
          <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
            <p className="text-lg font-semibold text-slate-200">
              No results found for “{query}”.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Try another keyword or add more records to the database.
            </p>
          </section>
        ) : (
          // State 3: matching records exist, grouped by content type.
          // 有搜索结果，按 Media / Blog / Photos 分组展示。
          <div className="space-y-12">
            <p className="text-sm text-slate-400">
              Found {totalResults} result{totalResults === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-cyan-300">“{query}”</span>.
            </p>

            {mediaItems.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">Media</h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Media results link back to the filtered media page. */}
                  {/* media搜索结果跳回对应分类页。 */}
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
                  {/* Blog results link to their dynamic detail pages. */}
                  {/* blog 结果跳转到 /blog/[slug] 详情页。 */}
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
                  {/* Photo results currently link back to the main photos page. */}
                  {/* 照片目前还没有详情页，先跳回 /photos。 */}
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
