import { NextRequest, NextResponse } from "next/server";
import {
  isAuthorizedAdminRequest,
  readAdminJsonRequestBody,
} from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await readAdminJsonRequestBody(request);

    const adminPassword = body?.adminPassword;

    if (!(await isAuthorizedAdminRequest(request, adminPassword))) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 },
      );
    }

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

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
