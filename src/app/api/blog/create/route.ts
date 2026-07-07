import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSessionRequest } from "@/lib/adminAuth";
import {
  BlogTaxonomyError,
  getOrCreateBlogCategory,
  getOrCreateBlogTags,
} from "@/lib/blogTaxonomy";
import { prisma } from "@/lib/prisma";
import { isValidSlug, normalizeSlug } from "@/lib/slug";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!(await isValidAdminSessionRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const title = body.title;
    const slug = body.slug;
    const excerpt = body.excerpt;
    const content = body.content;
    const coverImageUrl = body.coverImageUrl;
    const published = body.published;
    const categoryName = body.categoryName;
    const tagsText = body.tagsText;

    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 },
      );
    }

    if (typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const normalizedSlug = normalizeSlug(slug);

    if (!isValidSlug(normalizedSlug)) {
      return NextResponse.json(
        {
          error:
            "Slug can only use letters, numbers, and hyphens, for example: my-first-post.",
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

    const [category, tags] = await Promise.all([
      getOrCreateBlogCategory({
        name: categoryName,
      }),
      getOrCreateBlogTags(tagsText),
    ]);

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
        categoryId: category?.id ?? null,
        tags:
          tags.length > 0
            ? {
                create: tags.map((tag) => ({
                  tag: {
                    connect: {
                      id: tag.id,
                    },
                  },
                })),
              }
            : undefined,
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
    if (error instanceof BlogTaxonomyError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("Failed to create blog post:", error);

    return NextResponse.json(
      { error: "Failed to create blog post." },
      { status: 500 },
    );
  }
}
