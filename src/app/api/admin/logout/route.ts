import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  isProductionEnvironment,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

function clearAdminSession(request: NextRequest, status: 303 | 307) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), {
    status,
  });

  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProductionEnvironment(),
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function POST(request: NextRequest) {
  return clearAdminSession(request, 303);
}

export async function GET(request: NextRequest) {
  return clearAdminSession(request, 307);
}
