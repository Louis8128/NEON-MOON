"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/I18nProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const desktopNavItemClass =
  "inline-flex h-10 min-w-[76px] items-center justify-center gap-1 rounded-full px-3 text-sm font-medium text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white whitespace-nowrap";

const dropdownPanelClass =
  "invisible absolute left-0 top-full z-50 min-w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100";

const dropdownLinkClass =
  "block rounded-xl px-3 py-2 text-center text-sm text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white whitespace-nowrap";

const mobileNavLinkClass =
  "flex min-h-12 w-full items-center rounded-xl px-4 py-3 text-base font-medium text-[#eaf8ff] transition active:bg-[#caf0f8]/15";

const mobileSubNavLinkClass =
  "flex min-h-11 w-full items-center rounded-xl px-4 py-2.5 text-sm text-[#caf0f8] transition active:bg-[#caf0f8]/15";

export default function SiteHeader() {
  const { t } = useI18n();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [photosOpen, setPhotosOpen] = useState(false);

  const isHomePage = pathname === "/";

  const headerClassName = isHomePage
    ? "fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#023e8a]/35 backdrop-blur-md"
    : "sticky top-0 z-50 border-b border-[#caf0f8]/20 bg-[#023e8a]/95 backdrop-blur";

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setBlogOpen(false);
    setMediaOpen(false);
    setPhotosOpen(false);
  }

  return (
    <header className={headerClassName}>
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 xl:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="shrink-0 text-lg font-semibold tracking-[0.28em] text-white sm:text-xl"
        >
          NEON MOON
        </Link>

        {/* Desktop navigation */}
        <div className="hidden flex-1 items-center justify-end gap-4 xl:flex">
          <div className="flex items-center gap-2 text-[15px] font-medium text-[#eaf8ff]">
            <Link href="/" className={desktopNavItemClass}>
              {t.nav.home}
            </Link>

            {/* Blog */}
            <div className="group relative">
              <button type="button" className={desktopNavItemClass}>
                {t.nav.blog}

                <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                  ▾
                </span>
              </button>

              <div className={dropdownPanelClass}>
                <div className="min-w-[9.5rem] rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1 shadow-xl shadow-[#03045e]/30">
                  <Link href="/blog" className={dropdownLinkClass}>
                    {t.nav.posts}
                  </Link>

                  <Link href="/blog/archive" className={dropdownLinkClass}>
                    {t.nav.archives}
                  </Link>

                  <Link href="/blog/categories" className={dropdownLinkClass}>
                    {t.nav.categories}
                  </Link>

                  <Link href="/blog/tags" className={dropdownLinkClass}>
                    {t.nav.tags}
                  </Link>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="group relative">
              <button type="button" className={desktopNavItemClass}>
                {t.nav.media}

                <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                  ▾
                </span>
              </button>

              <div className={dropdownPanelClass}>
                <div className="min-w-[8rem] rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1 shadow-xl shadow-[#03045e]/30">
                  <Link href="/media" className={dropdownLinkClass}>
                    {t.nav.collection}
                  </Link>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="group relative">
              <button type="button" className={desktopNavItemClass}>
                {t.nav.photos}

                <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                  ▾
                </span>
              </button>

              <div className={dropdownPanelClass}>
                <div className="min-w-[8rem] rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1 shadow-xl shadow-[#03045e]/30">
                  <Link href="/photos" className={dropdownLinkClass}>
                    {t.nav.gallery}
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/about" className={desktopNavItemClass}>
              {t.nav.about}
            </Link>
          </div>

          {/* Desktop search */}
          <form action="/search" className="flex min-w-0 items-center gap-2">
            <input
              type="search"
              name="q"
              placeholder={t.nav.searchPlaceholder}
              className="h-10 w-40 rounded-full border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8] 2xl:w-48"
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

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#caf0f8]/25 bg-[#023e8a]/35 text-2xl text-white transition active:bg-[#caf0f8]/15 xl:hidden"
        >
          <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#caf0f8]/15 bg-[#023e8a]/95 backdrop-blur-xl xl:hidden"
        >
          <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                {t.nav.home}
              </Link>

              {/* Mobile Blog */}
              <div>
                <button
                  type="button"
                  onClick={() => setBlogOpen((open) => !open)}
                  aria-expanded={blogOpen}
                  className={`${mobileNavLinkClass} justify-between text-left`}
                >
                  <span>{t.nav.blog}</span>

                  <span
                    className={`text-sm text-[#caf0f8]/70 transition-transform ${
                      blogOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {blogOpen && (
                  <div className="ml-3 border-l border-[#caf0f8]/20 pl-3">
                    <Link
                      href="/blog"
                      onClick={closeMobileMenu}
                      className={mobileSubNavLinkClass}
                    >
                      {t.nav.posts}
                    </Link>

                    <Link
                      href="/blog/archive"
                      onClick={closeMobileMenu}
                      className={mobileSubNavLinkClass}
                    >
                      {t.nav.archives}
                    </Link>

                    <Link
                      href="/blog/categories"
                      onClick={closeMobileMenu}
                      className={mobileSubNavLinkClass}
                    >
                      {t.nav.categories}
                    </Link>

                    <Link
                      href="/blog/tags"
                      onClick={closeMobileMenu}
                      className={mobileSubNavLinkClass}
                    >
                      {t.nav.tags}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Media */}
              <div>
                <button
                  type="button"
                  onClick={() => setMediaOpen((open) => !open)}
                  aria-expanded={mediaOpen}
                  className={`${mobileNavLinkClass} justify-between text-left`}
                >
                  <span>{t.nav.media}</span>

                  <span
                    className={`text-sm text-[#caf0f8]/70 transition-transform ${
                      mediaOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {mediaOpen && (
                  <div className="ml-3 border-l border-[#caf0f8]/20 pl-3">
                    <Link
                      href="/media"
                      onClick={closeMobileMenu}
                      className={mobileSubNavLinkClass}
                    >
                      {t.nav.collection}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Photos */}
              <div>
                <button
                  type="button"
                  onClick={() => setPhotosOpen((open) => !open)}
                  aria-expanded={photosOpen}
                  className={`${mobileNavLinkClass} justify-between text-left`}
                >
                  <span>{t.nav.photos}</span>

                  <span
                    className={`text-sm text-[#caf0f8]/70 transition-transform ${
                      photosOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>

                {photosOpen && (
                  <div className="ml-3 border-l border-[#caf0f8]/20 pl-3">
                    <Link
                      href="/photos"
                      onClick={closeMobileMenu}
                      className={mobileSubNavLinkClass}
                    >
                      {t.nav.gallery}
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className={mobileNavLinkClass}
              >
                {t.nav.about}
              </Link>
            </div>

            {/* Mobile search */}
            <form
              action="/search"
              onSubmit={closeMobileMenu}
              className="mt-4 flex w-full items-center gap-2 border-t border-[#caf0f8]/15 pt-4"
            >
              <input
                type="search"
                name="q"
                placeholder={t.nav.searchPlaceholder}
                className="h-11 min-w-0 flex-1 rounded-full border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 text-base text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8]"
              />

              <button
                type="submit"
                className="h-11 shrink-0 rounded-full bg-[#caf0f8] px-5 text-sm font-semibold text-[#023e8a] transition active:bg-white"
              >
                {t.nav.search}
              </button>
            </form>

            {/* Mobile language switcher */}
            <div className="mt-4 border-t border-[#caf0f8]/15 pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
