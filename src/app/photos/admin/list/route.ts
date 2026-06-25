import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const adminPassword = body.adminPassword;

    // Reuse the temporary admin password system.
    // 复用 Blog / Media / Photo Upload 使用的管理员密码。
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
