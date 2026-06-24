import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const adminPassword = body.adminPassword;
    const mediaItemId = Number(body.id);

    // Reuse the temporary admin password system.
    // 复用 Blog / Photos / Media 后台的管理员密码。
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

    if (!Number.isInteger(mediaItemId) || mediaItemId <= 0) {
      return NextResponse.json(
        { error: "Invalid media item id." },
        { status: 400 },
      );
    }

    // Admin edit page needs the full media item content.
    // 后台编辑页需要读取完整媒体收藏信息。
    const mediaItem = await prisma.mediaItem.findUnique({
      where: {
        id: mediaItemId,
      },
      select: {
        id: true,
        title: true,
        category: true,
        creator: true,
        releaseYear: true,
        coverUrl: true,
        rating: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!mediaItem) {
      return NextResponse.json(
        { error: "Media item not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ mediaItem });
  } catch (error) {
    console.error("Failed to fetch admin media item:", error);

    return NextResponse.json(
      { error: "Failed to fetch admin media item." },
      { status: 500 },
    );
  }
}
