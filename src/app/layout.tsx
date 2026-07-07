import type { Metadata } from "next";
import type { ReactNode } from "react";
import { I18nProvider } from "@/components/I18nProvider";
import SiteHeader from "@/components/SiteHeader";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();
const ogImage = "/images/home-ocean-sky.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    images: [
      {
        url: ogImage,
        alt: "NEON MOON ocean and sky background",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [ogImage],
  },
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
