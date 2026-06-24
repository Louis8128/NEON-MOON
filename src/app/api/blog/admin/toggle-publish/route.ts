import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const adminPassword = body.adminPassword;
    const postId = Number(body.id);

    // Reuse the temporary admin password system.
    // 优先读取 ADMIN_PASSWORD，如果没有就复用照片上传密码。
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

    if (!Number.isInteger(postId) || postId <= 0) {
      return NextResponse.json(
        { error: "Invalid blog post id." },
        { status: 400 },
      );
    }

    const currentPost = await prisma.blogPost.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        slug: true,
        published: true,
      },
    });

    if (!currentPost) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 },
      );
    }

    // Toggle the published status.
    // 已发布变草稿，草稿变已发布。
    const updatedPost = await prisma.blogPost.update({
      where: {
        id: postId,
      },
      data: {
        published: !currentPost.published,
      },
      select: {
        id: true,
        slug: true,
        published: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("Failed to toggle blog post publish status:", error);

    return NextResponse.json(
      { error: "Failed to toggle blog post publish status." },
      { status: 500 },
    );
  }
}
