import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const adminPassword = body.adminPassword;
    const postId = Number(body.id);
    const title = body.title;
    const slug = body.slug;
    const excerpt = body.excerpt;
    const content = body.content;
    const coverImageUrl = body.coverImageUrl;
    const published = body.published;

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

    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 },
      );
    }

    if (typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    if (!isValidSlug(normalizedSlug)) {
      return NextResponse.json(
        {
          error:
            "Slug can only use lowercase letters, numbers, and hyphens, for example: my-first-post.",
        },
        { status: 400 },
      );
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400 },
      );
    }

    // Make sure the post exists before updating it.
    // 先确认要编辑的文章存在。
    const currentPost = await prisma.blogPost.findUnique({
      where: {
        id: postId,
      },
    });

    if (!currentPost) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 },
      );
    }

    // Slug must be unique, but the current post can keep its own slug.
    // slug 不能和其他文章重复，但可以保留自己的 slug。
    const postWithSameSlug = await prisma.blogPost.findUnique({
      where: {
        slug: normalizedSlug,
      },
    });

    if (postWithSameSlug && postWithSameSlug.id !== postId) {
      return NextResponse.json(
        { error: "This slug is already used by another blog post." },
        { status: 409 },
      );
    }

    const updatedPost = await prisma.blogPost.update({
      where: {
        id: postId,
      },
      data: {
        title: title.trim(),
        slug: normalizedSlug,
        excerpt:
          typeof excerpt === "string" && excerpt.trim() ? excerpt.trim() : null,
        content: content.trim(),
        coverImageUrl:
          typeof coverImageUrl === "string" && coverImageUrl.trim()
            ? coverImageUrl.trim()
            : null,
        published: Boolean(published),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("Failed to update blog post:", error);

    return NextResponse.json(
      { error: "Failed to update blog post." },
      { status: 500 },
    );
  }
}
