import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSessionRequest } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const mediaCategories = ["MUSIC", "BOOK", "MOVIE", "ANIME", "GAME"] as const;

type MediaCategoryValue = (typeof mediaCategories)[number];

function isValidMediaCategory(
  category: unknown,
): category is MediaCategoryValue {
  return (
    typeof category === "string" &&
    mediaCategories.includes(category as MediaCategoryValue)
  );
}

function parseOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return null;
  }

  return numberValue;
}

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
    const title = body.title;
    const category = body.category;
    const creator = body.creator;
    const releaseYear = parseOptionalNumber(body.releaseYear);
    const coverUrl = body.coverUrl;
    const rating = parseOptionalNumber(body.rating);
    const note = body.note;

    if (!Number.isInteger(mediaItemId) || mediaItemId <= 0) {
      return NextResponse.json(
        { error: "Invalid media item id." },
        { status: 400 },
      );
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 },
      );
    }

    if (!isValidMediaCategory(category)) {
      return NextResponse.json(
        { error: "Invalid media category." },
        { status: 400 },
      );
    }

    if (releaseYear !== null && !Number.isInteger(releaseYear)) {
      return NextResponse.json(
        { error: "Release year must be a whole number." },
        { status: 400 },
      );
    }

    if (rating !== null && (rating < 0 || rating > 10)) {
      return NextResponse.json(
        { error: "Rating must be between 0 and 10." },
        { status: 400 },
      );
    }

    // Check whether the media item exists before updating it.
    // 更新前先确认数据库里有这条媒体记录。
    const existingMediaItem = await prisma.mediaItem.findUnique({
      where: {
        id: mediaItemId,
      },
      select: {
        id: true,
      },
    });

    if (!existingMediaItem) {
      return NextResponse.json(
        { error: "Media item not found." },
        { status: 404 },
      );
    }

    // Update one MediaItem record in the database.
    // 把编辑后的媒体收藏信息保存回 MediaItem 表。
    const mediaItem = await prisma.mediaItem.update({
      where: {
        id: mediaItemId,
      },
      data: {
        title: title.trim(),
        category,
        creator:
          typeof creator === "string" && creator.trim() ? creator.trim() : null,
        releaseYear,
        coverUrl:
          typeof coverUrl === "string" && coverUrl.trim()
            ? coverUrl.trim()
            : null,
        rating,
        note: typeof note === "string" && note.trim() ? note.trim() : null,
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

    return NextResponse.json({ mediaItem });
  } catch (error) {
    console.error("Failed to update media item:", error);

    return NextResponse.json(
      { error: "Failed to update media item." },
      { status: 500 },
    );
  }
}
