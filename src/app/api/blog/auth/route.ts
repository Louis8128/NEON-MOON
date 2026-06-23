import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body.password;

    // Reuse the same temporary admin password system.
    // 优先读取 ADMIN_PASSWORD，如果没有就复用照片上传密码。
    const expectedPassword =
      process.env.ADMIN_PASSWORD ?? process.env.ADMIN_UPLOAD_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: "Admin password is not configured on the server." },
        { status: 500 },
      );
    }

    if (typeof password !== "string" || password !== expectedPassword) {
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
