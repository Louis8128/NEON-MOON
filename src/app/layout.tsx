import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEON MOON",
  description:
    "A personal full-stack portfolio website for blogs, media collections, and photography.",
};

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
        <header className="sticky top-0 z-50 border-b border-[#caf0f8]/20 bg-[#023e8a]/95 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-7">
              <Link
                href="/"
                className="text-lg font-bold tracking-[0.25em] text-white"
              >
                NEON MOON
              </Link>

              <div className="flex items-center gap-2 text-[15px] font-medium text-[#eaf8ff]">
                <Link
                  href="/"
                  className="rounded-xl px-3 py-2 transition hover:bg-[#caf0f8]/15 hover:text-white"
                >
                  Home
                </Link>

                {/* Blog dropdown navigation for public visitors. */}
                {/* Blog 公开下拉菜单：只展示公开文章入口，不暴露后台 Admin。 */}
                <div className="group relative w-28">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1 rounded-xl px-3 py-2 text-[15px] font-medium text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
                  >
                    Blog
                    <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                      ▾
                    </span>
                  </button>

                  {/*
                    Use pt-2 instead of margin-top.
                    This keeps the hover area connected while moving the mouse down.
                    用 padding 连接悬停区域，避免鼠标下移时菜单消失。
                  */}
                  <div className="invisible absolute left-0 top-full z-50 w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1.5 shadow-xl shadow-[#03045e]/30">
                      <Link
                        href="/blog"
                        className="block rounded-xl px-3 py-2 text-center text-sm text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
                      >
                        Posts
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Media dropdown navigation for public visitors. */}
                {/* Media 公开下拉菜单：只展示公开收藏入口，不暴露 Admin / New item。 */}
                <div className="group relative w-32">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1 rounded-xl px-3 py-2 text-[15px] font-medium text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
                  >
                    Media
                    <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                      ▾
                    </span>
                  </button>

                  {/*
                    Keep the dropdown hover area connected.
                    用 padding 连接悬停区域，避免鼠标下移时菜单消失。
                  */}
                  <div className="invisible absolute left-0 top-full z-50 w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1.5 shadow-xl shadow-[#03045e]/30">
                      <Link
                        href="/media"
                        className="block rounded-xl px-3 py-2 text-center text-sm text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
                      >
                        Collection
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Photos dropdown navigation for public visitors. */}
                {/* Photos 公开下拉菜单：只展示 Gallery，不暴露 Upload 后台入口。 */}
                <div className="group relative w-28">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1 rounded-xl px-3 py-2 text-[15px] font-medium text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
                  >
                    Photos
                    <span className="text-xs text-[#caf0f8]/65 transition group-hover:text-[#caf0f8]">
                      ▾
                    </span>
                  </button>

                  {/*
                    Use pt-2 instead of margin-top.
                    This keeps the hover area connected while moving the mouse down.
                    用 padding 连接悬停区域，避免鼠标下移时菜单消失。
                  */}
                  <div className="invisible absolute left-0 top-full z-50 w-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="rounded-2xl border border-[#caf0f8]/20 bg-[#023e8a]/95 p-1.5 shadow-xl shadow-[#03045e]/30">
                      <Link
                        href="/photos"
                        className="block rounded-xl px-3 py-2 text-center text-sm text-[#eaf8ff] transition hover:bg-[#caf0f8]/15 hover:text-white"
                      >
                        Gallery
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
                className="w-40 rounded-full border border-[#caf0f8]/30 bg-[#023e8a]/45 px-4 py-2 text-sm text-white placeholder:text-[#caf0f8]/60 outline-none transition focus:border-[#caf0f8] md:w-56"
              />

              <button
                type="submit"
                className="rounded-full bg-[#caf0f8] px-4 py-2 text-sm font-semibold text-[#023e8a] transition hover:bg-white"
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
