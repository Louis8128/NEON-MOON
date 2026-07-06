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

    // Admin list returns all photo records from the database.
    // 后台读取所有照片记录，包括上传图片和静态种子图片。
    const photos = await prisma.photo.findMany({
      orderBy: [
        {
          takenAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        title: true,
        imageUrl: true,
        location: true,
        description: true,
        takenAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Failed to fetch admin photo list:", error);

    return NextResponse.json(
      { error: "Failed to fetch admin photo list." },
      { status: 500 },
    );
  }
}
