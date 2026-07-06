import { NextRequest, NextResponse } from "next/server";
import {
  isAuthorizedAdminRequest,
  isValidAdminSessionRequest,
  readAdminJsonRequestBody,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (await isValidAdminSessionRequest(request)) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await readAdminJsonRequestBody(request);
    const password = body?.password ?? body?.adminPassword;

    if (!(await isAuthorizedAdminRequest(request, password))) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}
