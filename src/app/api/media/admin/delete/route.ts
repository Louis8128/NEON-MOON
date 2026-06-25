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

    // Check whether the media item exists before deleting it.
    // 删除前先确认数据库里确实存在这条媒体记录。
    const existingMediaItem = await prisma.mediaItem.findUnique({
      where: {
        id: mediaItemId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!existingMediaItem) {
      return NextResponse.json(
        { error: "Media item not found." },
        { status: 404 },
      );
    }

    // Hard delete the media item from the database.
    // 从 MediaItem 表中永久删除这条记录。
    await prisma.mediaItem.delete({
      where: {
        id: mediaItemId,
      },
    });

    return NextResponse.json({
      deletedMediaItem: existingMediaItem,
    });
  } catch (error) {
    console.error("Failed to delete media item:", error);

    return NextResponse.json(
      { error: "Failed to delete media item." },
      { status: 500 },
    );
  }
}
