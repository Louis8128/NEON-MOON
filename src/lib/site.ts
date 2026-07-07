export const SITE_NAME = "NEON MOON";

export const SITE_DESCRIPTION =
  "NEON MOON is a quiet personal site for writing, photos, media notes, and slowly growing ideas.";

const LOCAL_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!rawSiteUrl) {
    return LOCAL_SITE_URL;
  }

  try {
    return new URL(rawSiteUrl).toString().replace(/\/+$/, "");
  } catch {
    return LOCAL_SITE_URL;
  }
}

export function getAbsoluteUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
