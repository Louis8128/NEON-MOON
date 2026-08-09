import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  isProductionEnvironment,
} from "@/lib/adminAuth";
import { getAbsoluteUrl } from "@/lib/site";

export const runtime = "nodejs";

function clearAdminSession(status: 303 | 307) {
  const response = NextResponse.redirect(
    new URL(getAbsoluteUrl("/admin/login")),
    {
      status,
    },
  );

  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProductionEnvironment(),
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function POST() {
  return clearAdminSession(303);
}

export async function GET() {
  return clearAdminSession(307);
}
