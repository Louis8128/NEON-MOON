import Link from "next/link";
import { prisma } from "@/lib/prisma";

type MediaPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const mediaCategories = ["MOVIE", "MUSIC", "BOOK", "ANIME", "GAME"] as const;

type MediaCategory = (typeof mediaCategories)[number];
type MediaFilter = "ALL" | MediaCategory;

function isValidMediaCategory(category: unknown): category is MediaCategory {
  return (
    typeof category === "string" &&
    mediaCategories.includes(category as MediaCategory)
  );
}

function formatCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

function getCategoryHref(category: MediaFilter) {
  if (category === "ALL") {
    return "/media";
  }

  return `/media?category=${category}`;
}

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const { category } = await searchParams;

  // Read the selected category from the URL query string.
  // 从 URL 查询参数读取当前分类筛选。
  const activeFilter: MediaFilter = isValidMediaCategory(category)
    ? category
    : "ALL";

  // Load public media items from the database.
  // 从数据库读取公开媒体收藏列表。
  const mediaItems = await prisma.mediaItem.findMany({
    where:
      activeFilter === "ALL"
        ? undefined
        : {
            category: activeFilter,
          },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      category: true,
      creator: true,
      releaseYear: true,
      coverUrl: true,
      rating: true,
      note: true,
      updatedAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <section className="mx-auto max-w-6xl">
        {/* Public page header. */}
        {/* 公开媒体页面标题区域，不显示后台管理入口。 */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Media Collection
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Movies, music, books, anime, and games
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            A personal archive of media that shaped my taste, memory, and
            creative references.
          </p>
        </div>

        {/* Category filters. */}
        {/* 公开媒体页面的分类筛选。 */}
        <div className="mt-10 flex flex-wrap gap-3">
          {(["ALL", ...mediaCategories] as MediaFilter[]).map((filter) => (
            <Link
              key={filter}
              href={getCategoryHref(filter)}
              className={
                activeFilter === filter
                  ? "rounded-full bg-[#caf0f8] px-4 py-2 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
                  : "rounded-full border border-[#caf0f8]/50 px-4 py-2 text-sm font-semibold text-[#caf0f8] transition hover:bg-[#caf0f8] hover:text-[#023e8a]"
              }
            >
              {filter === "ALL" ? "All" : formatCategory(filter)}
            </Link>
          ))}
        </div>

        {mediaItems.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-[#caf0f8]/40 bg-[#03045e]/45 p-10 text-center">
            <p className="text-lg font-semibold text-[#f8fcff]">
              No media items found.
            </p>

            <p className="mt-2 text-sm text-[#caf0f8]/80">
              New media notes will appear here once they are added to the
              collection.
            </p>
          </div>
        ) : (
          // Each card links to /media/[id].
          // 每张卡片都可以点击进入媒体详情页。
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mediaItems.map((item) => (
              <Link
                key={item.id}
                href={`/media/${item.id}`}
                className="group overflow-hidden rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 shadow-lg shadow-[#03045e]/20 backdrop-blur transition hover:-translate-y-1 hover:border-[#caf0f8]/50 hover:bg-[#03045e]/65"
              >
                {item.coverUrl ? (
                  <div
                    className="h-56 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                    style={{
                      backgroundImage: `url(${item.coverUrl})`,
                    }}
                    aria-label={`${item.title} cover image`}
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-[#03045e]/65 px-6 text-center">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#caf0f8]">
                        {formatCategory(item.category)}
                      </p>

                      <p className="mt-3 text-xl font-bold text-white">
                        {item.title}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#caf0f8]/40 bg-[#caf0f8]/10 px-3 py-1 text-xs font-semibold text-[#caf0f8]">
                      {formatCategory(item.category)}
                    </span>

                    {item.rating !== null && (
                      <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                        {item.rating}/10
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-2xl font-bold tracking-tight text-white transition group-hover:text-[#caf0f8]">
                    {item.title}
                  </h2>

                  <div className="mt-3 space-y-1 text-sm text-[#caf0f8]/80">
                    <p>{item.creator ?? "Unknown creator"}</p>

                    {item.releaseYear && <p>Released in {item.releaseYear}</p>}
                  </div>

                  {item.note && (
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#caf0f8]/80">
                      {item.note}
                    </p>
                  )}

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#caf0f8] opacity-80 transition group-hover:opacity-100">
                    View detail →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
