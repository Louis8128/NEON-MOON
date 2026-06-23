import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const adminPassword = body.adminPassword;

    // Reuse the temporary admin password system.
    // 中文关键词：优先读取 ADMIN_PASSWORD，如果没有就复用照片上传密码。
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

    // Admin list returns both published posts and drafts.
    // 中文关键词：后台管理页可以查看已发布文章和草稿。
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to fetch admin blog list:", error);

    return NextResponse.json(
      { error: "Failed to fetch admin blog list." },
      { status: 500 },
    );
  }
}
