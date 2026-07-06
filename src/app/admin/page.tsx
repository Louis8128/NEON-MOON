"use client";

import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";
import { useI18n } from "@/components/I18nProvider";

const adminCards = [
  {
    key: "blog",
    href: "/blog/admin",
  },
  {
    key: "media",
    href: "/media/admin",
  },
  {
    key: "photos",
    href: "/photos/admin",
  },
] as const;

export default function AdminDashboardPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#0077b6] px-6 py-20 text-white">
      <section className="mx-auto max-w-6xl">
        <AdminHeader
          section={{
            en: "Dashboard",
            zh: "后台首页",
          }}
          showDashboardLink={false}
          links={[
            {
              href: "/",
              label: {
                en: "← Back to Home",
                zh: "← 返回首页",
              },
              muted: true,
            },
          ]}
        />

        {/* Admin dashboard header. */}
        {/* 统一后台入口页面标题。 */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#caf0f8]">
            {t.adminDashboard.eyebrow}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            {t.adminDashboard.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#eaf8ff]">
            {t.adminDashboard.description}
          </p>
        </div>

        {/* Admin module cards. */}
        {/* 后台功能模块入口卡片。 */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {adminCards.map((card) => {
            const cardText = t.adminDashboard.cards[card.key];

            return (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-3xl border border-[#caf0f8]/25 bg-[#023e8a]/75 p-6 shadow-lg shadow-[#03045e]/20 backdrop-blur transition hover:-translate-y-1 hover:border-[#caf0f8]/60 hover:bg-[#03045e]/65"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#caf0f8]">
                  {t.adminDashboard.cardKicker}
                </p>

                <h2 className="mt-4 text-2xl font-bold text-white transition group-hover:text-[#caf0f8]">
                  {cardText.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#eaf8ff]">
                  {cardText.description}
                </p>

                <p className="mt-6 text-sm font-semibold text-[#caf0f8] transition group-hover:text-white">
                  {cardText.label} →
                </p>
              </Link>
            );
          })}
        </div>

        {/* Direct URL reminder. */}
        {/* 提醒后台没有放在公开导航栏，需要手动输入 /admin。 */}
        <div className="mt-10 rounded-3xl border border-[#caf0f8]/25 bg-[#03045e]/65 p-5 text-sm leading-7 text-[#caf0f8]/80 backdrop-blur">
          <p>
            {t.adminDashboard.directNoticePrefix}
            <span className="text-white">/admin</span>
            {t.adminDashboard.directNoticeSuffix}
          </p>
        </div>
      </section>
    </main>
  );
}
