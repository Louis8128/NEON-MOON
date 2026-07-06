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

    const postId = Number(body.id);

    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json(
        { error: "Invalid blog post id." },
        { status: 400 },
      );
    }

    // Admin edit page needs the full post content, including draft posts.
    // 后台编辑页需要读取完整文章内容，包括草稿。
    const post = await prisma.blogPost.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImageUrl: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Failed to fetch admin blog post:", error);

    return NextResponse.json(
      { error: "Failed to fetch admin blog post." },
      { status: 500 },
    );
  }
}
