import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const adminPassword = body.adminPassword;

    // Reuse the temporary admin password system.
    // 复用 Blog 后台和 Photos 上传使用的管理员密码。
    const expectedPassword =
      process.env.ADMIN_PASSWORD ?? process.env.ADMIN_UPLOAD_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: "Admin password is not configured on the server." },
        { status: 500 },
      );
    }

    if (
      typeof adminPassword !== "string" ||
      adminPassword !== expectedPassword
    ) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 },
      );
    }

    // Admin list returns all media items from the database.
    // 后台读取所有媒体收藏记录。
    const mediaItems = await prisma.mediaItem.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        category: true,
        creator: true,
        releaseYear: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ mediaItems });
  } catch (error) {
    console.error("Failed to fetch admin media list:", error);

    return NextResponse.json(
      { error: "Failed to fetch admin media list." },
      { status: 500 },
    );
  }
}
