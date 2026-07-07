"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const navItemClass =
  "inline-flex h-10 min-w-[76px] items-center justify-center gap-1 rounded-full px-3 text-sm font-medium text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white whitespace-nowrap";

const dropdownPanelClass =
  "invisible absolute left-0 top-full z-50 min-w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100";

const dropdownLinkClass =
  "block rounded-xl px-4 py-2 text-center text-sm text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white whitespace-nowrap";

export default function SiteHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const headerClassName = isHomePage
    ? "fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#023e8a]/35 backdrop-blur-md"
    : "sticky top-0 z-50 border-b border-[#caf0f8]/20 bg-[#023e8a]/95 backdrop-blur";

  return (
    <header className={headerClassName}>
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-[0.25em] text-white"
          >
            NEON MOON
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-[#eaf8ff]">
            <Link
              href="/"
              className={navItemClass}
            >
              {t.nav.home}
            </Link>

            <Link
              href="/about"
              className={navItemClass}
            >
              {t.nav.about}
            </Link>

            <div className="group relative">
              <button
                type="button"
                className={navItemClass}
              >
                {t.nav.blog}
                <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                  ▾
                </span>
              </button>

              <div className={dropdownPanelClass}>
                <div className="min-w-[76px] rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1.5 shadow-xl shadow-[#03045e]/30">
                  <Link
                    href="/blog"
                    className={dropdownLinkClass}
                  >
                    {t.nav.posts}
                  </Link>
                </div>
              </div>
            </div>

            <div className="group relative">
              <button
                type="button"
                className={navItemClass}
              >
                {t.nav.media}
                <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                  ▾
                </span>
              </button>

              <div className={dropdownPanelClass}>
                <div className="min-w-[76px] rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1.5 shadow-xl shadow-[#03045e]/30">
                  <Link
                    href="/media"
                    className={dropdownLinkClass}
                  >
                    {t.nav.collection}
                  </Link>
                </div>
              </div>
            </div>

            <div className="group relative">
              <button
                type="button"
                className={navItemClass}
              >
                {t.nav.photos}
                <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                  ▾
                </span>
              </button>

              <div className={dropdownPanelClass}>
                <div className="min-w-[76px] rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1.5 shadow-xl shadow-[#03045e]/30">
                  <Link
                    href="/photos"
                    className={dropdownLinkClass}
                  >
                    {t.nav.gallery}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
          <form
            action="/search"
            className="flex w-full min-w-0 items-center gap-2 sm:w-auto"
          >
            <input
              type="search"
              name="q"
              placeholder={t.nav.searchPlaceholder}
              className="h-10 min-w-0 flex-1 rounded-full border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8] sm:w-40 sm:flex-none xl:w-48"
            />

            <button
              type="submit"
              className="h-10 min-w-[64px] rounded-full bg-[#caf0f8] px-4 text-sm font-semibold whitespace-nowrap text-[#023e8a] transition hover:bg-white"
            >
              {t.nav.search}
            </button>
          </form>

          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
