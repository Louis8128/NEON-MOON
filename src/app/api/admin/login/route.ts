import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionCookieValue,
  getAdminSessionMaxAgeSeconds,
  getExpectedAdminPassword,
  getSafeAdminRedirectPath,
  isProductionEnvironment,
  isValidAdminPassword,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

type LoginRedirectError =
  | "invalid"
  | "missing-secret"
  | "missing-password"
  | "invalid-request";

type LoginRequestBody = {
  password: string;
  next: string;
};

function buildLoginRedirect(
  request: NextRequest,
  error: LoginRedirectError,
  nextPath: string,
) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("error", error);
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl, { status: 303 });
}

async function readLoginRequestBody(
  request: NextRequest,
): Promise<LoginRequestBody> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as unknown;

    if (!body || typeof body !== "object") {
      return {
        password: "",
        next: "/admin",
      };
    }

    const candidate = body as Record<string, unknown>;

    return {
      password:
        typeof candidate.password === "string" ? candidate.password : "",
      next: typeof candidate.next === "string" ? candidate.next : "/admin",
    };
  }

  const formData = await request.formData();
  const password = formData.get("password");
  const next = formData.get("next");

  return {
    password: typeof password === "string" ? password : "",
    next: typeof next === "string" ? next : "/admin",
  };
}

export async function POST(request: NextRequest) {
  let loginBody: LoginRequestBody;

  try {
    loginBody = await readLoginRequestBody(request);
  } catch {
    return buildLoginRedirect(request, "invalid-request", "/admin");
  }

  const nextPath = getSafeAdminRedirectPath(loginBody.next);

  if (!getExpectedAdminPassword()) {
    return buildLoginRedirect(request, "missing-password", nextPath);
  }

  if (!isValidAdminPassword(loginBody.password)) {
    return buildLoginRedirect(request, "invalid", nextPath);
  }

  let cookieValue: string;

  try {
    cookieValue = await createAdminSessionCookieValue();
  } catch {
    return buildLoginRedirect(request, "missing-secret", nextPath);
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), {
    status: 303,
  });

  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProductionEnvironment(),
    path: "/",
    maxAge: getAdminSessionMaxAgeSeconds(),
  });

  return response;
}
