import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  isProtectedAdminPath,
  verifyAdminSessionCookie,
} from "@/lib/adminAuth";

function shouldProtectPath(pathname: string) {
  return pathname !== "/admin/login" && isProtectedAdminPath(pathname);
}

function buildLoginUrl(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.searchParams.set("next", nextPath);

  return loginUrl;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!shouldProtectPath(pathname)) {
    return NextResponse.next();
  }

  const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const isAdmin = await verifyAdminSessionCookie(adminSession);

  if (isAdmin) {
    return NextResponse.next();
  }

  return NextResponse.redirect(buildLoginUrl(request));
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/blog/admin/:path*",
    "/blog/new",
    "/media/admin/:path*",
    "/photos/admin/:path*",
    "/photos/upload",
  ],
};
