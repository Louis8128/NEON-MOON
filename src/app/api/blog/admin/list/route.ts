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
