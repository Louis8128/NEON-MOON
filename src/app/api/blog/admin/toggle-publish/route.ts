import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSessionRequest } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!(await isValidAdminSessionRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const postId = Number(body.id);

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
