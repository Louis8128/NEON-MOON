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
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
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
            className="min-w-0 flex-1 rounded-full border border-[#caf0f8]/30 bg-[#023e8a]/45 px-5 py-3 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
          />
          <button
            type="submit"
            className="rounded-full bg-[#caf0f8] px-5 py-3 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
          >
            Search
          </button>
        </form>

        {/* State 1: no query has been entered yet. */}
        {/* 还没有输入搜索词。 */}
        {!query ? (
          <section className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              Enter a keyword to search.
            </p>
            <p className="mt-2 text-sm text-[#caf0f8]/80">
              Try words like moon, Tokyo, music, website, or Interstellar.
            </p>
          </section>
        ) : totalResults === 0 ? (
          // State 2: query exists, but no database records matched it.
          // 有搜索词，但没有结果。
          <section className="rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              No results found for “{query}”.
            </p>
            <p className="mt-2 text-sm text-[#caf0f8]/80">
              Try another keyword or add more records to the database.
            </p>
          </section>
        ) : (
          // State 3: matching records exist, grouped by content type.
          // 有搜索结果，按 Media / Blog / Photos 分组展示。
          <div className="space-y-12">
            <p className="text-sm text-[#caf0f8]/80">
              Found {totalResults} result{totalResults === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-[#caf0f8]">“{query}”</span>.
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
                      className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-5 transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]">
                        {item.category}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {item.title}
                      </h3>
                      {item.creator && (
                        <p className="mt-2 text-sm text-[#caf0f8]/80">
                          {item.creator}
                        </p>
                      )}
                      {item.note && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#eaf8ff]">
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
                      className="block rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-5 transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]">
                        Blog Post
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-3 text-sm leading-6 text-[#eaf8ff]">
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
                      className="rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-5 transition hover:-translate-y-1 hover:border-[#caf0f8]/60"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#caf0f8]">
                        Photo
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-white">
                        {photo.title}
                      </h3>
                      {photo.location && (
                        <p className="mt-2 text-sm text-[#caf0f8]/80">
                          {photo.location}
                        </p>
                      )}
                      {photo.description && (
                        <p className="mt-3 text-sm leading-6 text-[#eaf8ff]">
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
