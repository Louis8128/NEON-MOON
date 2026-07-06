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
