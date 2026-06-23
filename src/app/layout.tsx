import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEON MOON",
  description:
    "A personal full-stack portfolio website for blogs, media collections, and photography.",
};

// Main navigation items that do not need dropdown menus.
// 普通导航链接，不包含 Blog 和 Photos 这种下拉菜单。
const navItems = [{ label: "Media", href: "/media" }];

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Shared header shown on every route in the App Router. */}
        {/* 全站共享布局，所有页面都会包在 layout 里面。 */}
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-7">
              <Link
                href="/"
                className="text-lg font-bold tracking-[0.25em] text-white"
              >
                NEON MOON
              </Link>

              <div className="flex items-center gap-2 text-[15px] font-medium text-slate-300">
                <Link
                  href="/"
                  className="rounded-xl px-3 py-2 transition hover:bg-slate-800/70 hover:text-white"
                >
                  Home
                </Link>

                {/* Blog dropdown navigation. */}
                {/* Blog 下拉菜单，包含文章列表、新建文章和后台管理。 */}
                <div className="group relative w-28">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1 rounded-xl px-3 py-2 text-[15px] font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white"
                  >
                    Blog
                    <span className="text-xs text-slate-500 transition group-hover:text-cyan-300">
                      ▾
                    </span>
                  </button>

                  {/*
                    Use pt-2 instead of margin-top.
                    This keeps the hover area connected while moving the mouse down.
                    用 padding 连接悬停区域，避免鼠标下移时菜单消失。
                  */}
                  <div className="invisible absolute left-0 top-full z-50 w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 p-1.5 shadow-xl shadow-black/30">
                      <Link
                        href="/blog"
                        className="block rounded-xl px-3 py-2 text-center text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        Posts
                      </Link>

                      <Link
                        href="/blog/new"
                        className="block rounded-xl px-3 py-2 text-center text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        New
                      </Link>

                      <Link
                        href="/blog/admin"
                        className="block rounded-xl px-3 py-2 text-center text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        Admin
                      </Link>
                    </div>
                  </div>
                </div>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-2 transition hover:bg-slate-800/70 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Photos dropdown navigation. */}
                {/* Photos 下拉菜单，Gallery 和 Upload 共用一个入口。 */}
                <div className="group relative w-28">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1 rounded-xl px-3 py-2 text-[15px] font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white"
                  >
                    Photos
                    <span className="text-xs text-slate-500 transition group-hover:text-cyan-300">
                      ▾
                    </span>
                  </button>

                  {/*
                    Use pt-2 instead of margin-top.
                    This keeps the hover area connected while moving the mouse down.
                    用 padding 连接悬停区域，避免鼠标下移时菜单消失。
                  */}
                  <div className="invisible absolute left-0 top-full z-50 w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/95 p-1.5 shadow-xl shadow-black/30">
                      <Link
                        href="/photos"
                        className="block rounded-xl px-3 py-2 text-center text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        Gallery
                      </Link>

                      <Link
                        href="/photos/upload"
                        className="block rounded-xl px-3 py-2 text-center text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                      >
                        Upload
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plain HTML form for global site search. */}
            {/* 全站搜索入口，提交后跳转到 /search?q=关键词。 */}
            <form action="/search" className="flex items-center gap-2">
              <input
                type="search"
                name="q"
                placeholder="Search..."
                className="w-40 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 md:w-56"
              />
              <button
                type="submit"
                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Search
              </button>
            </form>
          </nav>
        </header>

        {/* Current route content is rendered here. */}
        {/* children 代表当前页面内容，例如 /media 或 /blog。 */}
        {children}
      </body>
    </html>
  );
}
