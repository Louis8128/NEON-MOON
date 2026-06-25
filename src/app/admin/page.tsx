import Link from "next/link";

const adminCards = [
  {
    title: "Blog Admin",
    description:
      "Create, edit, publish, unpublish, and manage personal blog posts.",
    href: "/blog/admin",
    label: "Manage blog",
  },
  {
    title: "Media Admin",
    description:
      "Create, edit, delete, and manage movies, music, books, anime, and games.",
    href: "/media/admin",
    label: "Manage media",
  },
  {
    title: "Photos Admin",
    description:
      "Review photo records, upload new images, and manage gallery metadata.",
    href: "/photos/admin",
    label: "Manage photos",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm font-semibold text-[#caf0f8] transition hover:text-white"
        >
          ← Back to Home
        </Link>

        {/* Admin dashboard header. */}
        {/* 统一后台入口页面标题。 */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            Admin Dashboard
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Manage NEON MOON
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            A private entry point for managing blog posts, media collections,
            and photography uploads.
          </p>
        </div>

        {/* Temporary security notice. */}
        {/* 当前后台仍然使用临时密码系统，正式上线前需要升级。 */}
        <div className="mt-8 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm leading-7 text-amber-100">
          <p className="font-semibold text-amber-200">
            Development-stage admin area
          </p>
          <p className="mt-2 text-amber-50/90">
            These admin pages still use the temporary password-based protection.
            Before public deployment, this should be upgraded to a unified login
            system with protected sessions.
          </p>
        </div>

        {/* Admin module cards. */}
        {/* 后台功能模块入口卡片。 */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {adminCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur transition hover:-translate-y-1 hover:border-[#caf0f8]/60 hover:bg-[#03045e]/65"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#caf0f8]">
                Admin
              </p>

              <h2 className="mt-4 text-2xl font-bold text-white transition group-hover:text-[#caf0f8]">
                {card.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#eaf8ff]">
                {card.description}
              </p>

              <p className="mt-6 text-sm font-semibold text-[#caf0f8] transition group-hover:text-white">
                {card.label} →
              </p>
            </Link>
          ))}
        </div>

        {/* Direct URL reminder. */}
        {/* 提醒后台没有放在公开导航栏，需要手动输入 /admin。 */}
        <div className="mt-10 rounded-3xl border border-[#caf0f8]/25 bg-[#03045e]/65 p-5 text-sm leading-7 text-[#caf0f8]/80 backdrop-blur">
          <p>
            This page is intentionally not shown in the public navigation bar.
            Access it directly through{" "}
            <span className="text-white">/admin</span>.
          </p>
        </div>
      </section>
    </main>
  );
}
