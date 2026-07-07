import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/blog/admin",
        "/blog/new",
        "/media/admin",
        "/photos/admin",
        "/photos/upload",
        "/api",
      ],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
