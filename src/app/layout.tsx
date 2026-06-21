import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEON MOON",
  description:
    "A personal full-stack portfolio website for blogs, media collections, and photography.",
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Media", href: "/media" },
  { label: "Photos", href: "/photos" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-bold tracking-[0.25em] text-white">
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
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}