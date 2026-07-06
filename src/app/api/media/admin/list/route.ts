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
