import { NextResponse } from "next/server";
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const adminPassword = body.adminPassword;
    const title = body.title;
    const category = body.category;
    const creator = body.creator;
    const releaseYear = parseOptionalNumber(body.releaseYear);
    const coverUrl = body.coverUrl;
    const rating = parseOptionalNumber(body.rating);
    const note = body.note;

    // Reuse the temporary admin password system.
    // 复用 Blog 和 Photos 使用的管理员密码。
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

    // Create one MediaItem record in the database.
    // 向 MediaItem 表新增一条媒体收藏记录。
    const mediaItem = await prisma.mediaItem.create({
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
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ mediaItem }, { status: 201 });
  } catch (error) {
    console.error("Failed to create media item:", error);

    return NextResponse.json(
      { error: "Failed to create media item." },
      { status: 500 },
    );
  }
}
