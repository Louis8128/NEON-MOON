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

    const postId = Number(body.id);
    const title = body.title;
    const slug = body.slug;
    const excerpt = body.excerpt;
    const content = body.content;
    const coverImageUrl = body.coverImageUrl;
    const published = body.published;
    const categoryName = body.categoryName;
    const tagsText = body.tagsText;

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

    const [category, tags] = await Promise.all([
      getOrCreateBlogCategory({
        name: categoryName,
      }),
      getOrCreateBlogTags(tagsText),
    ]);

    const updatedPost = await prisma.$transaction(async (tx) => {
      await tx.blogPostTag.deleteMany({
        where: {
          postId,
        },
      });

      return tx.blogPost.update({
        where: {
          id: postId,
        },
        data: {
          title: title.trim(),
          slug: normalizedSlug,
          excerpt:
            typeof excerpt === "string" && excerpt.trim()
              ? excerpt.trim()
              : null,
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
        select: {
          id: true,
          title: true,
          slug: true,
          published: true,
          updatedAt: true,
        },
      });
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    if (error instanceof BlogTaxonomyError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("Failed to update blog post:", error);

    return NextResponse.json(
      { error: "Failed to update blog post." },
      { status: 500 },
    );
  }
}
