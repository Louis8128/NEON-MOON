import type { Metadata } from "next";
import type { ReactNode } from "react";
import { I18nProvider } from "@/components/I18nProvider";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEON MOON",
  description:
    "NEON MOON is a quiet personal site for writing, photos, media notes, and slowly growing ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <SiteHeader />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
