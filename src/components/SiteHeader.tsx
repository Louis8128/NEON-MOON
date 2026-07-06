"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-[#caf0f8]/20 bg-[#023e8a]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-7">
          <Link
            href="/"
            className="text-lg font-bold tracking-[0.25em] text-white"
          >
            NEON MOON
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-[15px] font-medium text-[#eaf8ff]">
            <Link
              href="/"
              className="rounded-xl px-3 py-2 transition hover:bg-[#caf0f8]/15 hover:text-white"
            >
              {t.nav.home}
            </Link>

            <div className="group relative w-28">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-1 rounded-xl px-3 py-2 text-[15px] font-medium text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
              >
                {t.nav.blog}
                <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                  ▾
                </span>
              </button>

              <div className="invisible absolute left-0 top-full z-50 w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1.5 shadow-xl shadow-[#03045e]/30">
                  <Link
                    href="/blog"
                    className="block rounded-xl px-3 py-2 text-center text-sm text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
                  >
                    {t.nav.posts}
                  </Link>
                </div>
              </div>
            </div>

            <div className="group relative w-32">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-1 rounded-xl px-3 py-2 text-[15px] font-medium text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
              >
                {t.nav.media}
                <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                  ▾
                </span>
              </button>

              <div className="invisible absolute left-0 top-full z-50 w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1.5 shadow-xl shadow-[#03045e]/30">
                  <Link
                    href="/media"
                    className="block rounded-xl px-3 py-2 text-center text-sm text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
                  >
                    {t.nav.collection}
                  </Link>
                </div>
              </div>
            </div>

            <div className="group relative w-28">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-1 rounded-xl px-3 py-2 text-[15px] font-medium text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
              >
                {t.nav.photos}
                <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                  ▾
                </span>
              </button>

              <div className="invisible absolute left-0 top-full z-50 w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1.5 shadow-xl shadow-[#03045e]/30">
                  <Link
                    href="/photos"
                    className="block rounded-xl px-3 py-2 text-center text-sm text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
                  >
                    {t.nav.gallery}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form action="/search" className="flex items-center gap-2">
            <input
              type="search"
              name="q"
              placeholder={t.nav.searchPlaceholder}
              className="w-40 rounded-full border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-2 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8] md:w-56"
            />

            <button
              type="submit"
              className="rounded-full bg-[#caf0f8] px-4 py-2 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
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
