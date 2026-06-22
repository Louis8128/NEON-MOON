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
    const title = body.title;
    const slug = body.slug;
    const excerpt = body.excerpt;
    const content = body.content;
    const coverImageUrl = body.coverImageUrl;
    const published = body.published;

    const expectedPassword = process.env.ADMIN_PASSWORD;

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

    const existingPost = await prisma.blogPost.findUnique({
      where: {
        slug: normalizedSlug,
      },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "This slug is already used by another blog post." },
        { status: 409 },
      );
    }

    const post = await prisma.blogPost.create({
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
    });

    return NextResponse.json(
      {
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          published: post.published,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create blog post:", error);

    return NextResponse.json(
      { error: "Failed to create blog post." },
      { status: 500 },
    );
  }
}
