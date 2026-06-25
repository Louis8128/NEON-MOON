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
    title: "Photo Upload",
    description:
      "Upload new photography records and save image metadata to the database.",
    href: "/photos/upload",
    label: "Upload photos",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to Home
        </Link>

        {/* Admin dashboard header. */}
        {/* 统一后台入口页面标题。 */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
            Admin Dashboard
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Manage NEON MOON
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
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
          <p className="mt-2 text-amber-100/90">
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
              className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Admin
              </p>

              <h2 className="mt-4 text-2xl font-bold text-white transition group-hover:text-cyan-200">
                {card.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                {card.description}
              </p>

              <p className="mt-6 text-sm font-semibold text-cyan-300 transition group-hover:text-cyan-200">
                {card.label} →
              </p>
            </Link>
          ))}
        </div>

        {/* Direct URL reminder. */}
        {/* 提醒后台没有放在公开导航栏，需要手动输入 /admin。 */}
        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/50 p-5 text-sm leading-7 text-slate-400">
          <p>
            This page is intentionally not shown in the public navigation bar.
            Access it directly through{" "}
            <span className="text-slate-200">/admin</span>.
          </p>
        </div>
      </section>
    </main>
  );
}
