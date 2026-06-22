import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(mediaItems);
  } catch (error) {
    console.error("Failed to fetch media items:", error);

    return NextResponse.json(
      { error: "Failed to fetch media items" },
      { status: 500 },
    );
  }
}
