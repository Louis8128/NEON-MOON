import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSessionRequest } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!(await isValidAdminSessionRequest(request))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    const mediaItemId = Number(body.id);

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
