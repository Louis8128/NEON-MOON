import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEON MOON",
  description:
    "A personal full-stack portfolio website for blogs, media collections, and photography.",
};

// Central navigation config used by the shared site header.
// 导航配置数组，避免重复手写多个 Link。
const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Media", href: "/media" },
  { label: "Photos", href: "/photos" },
];

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
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/"
                className="text-lg font-bold tracking-[0.25em] text-white"
              >
                NEON MOON
              </Link>

              <div className="flex items-center gap-5 text-sm text-slate-300">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
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
