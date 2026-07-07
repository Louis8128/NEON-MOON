import { prisma } from "@/lib/prisma";
import { isValidSlug, normalizeSlug } from "@/lib/slug";
import { type BlogTagSummary } from "@/lib/blogTypes";

export class BlogTaxonomyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlogTaxonomyError";
  }
}

function getOptionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : "";
}

function assertUsableSlug(slug: string, label: string) {
  if (!slug || !isValidSlug(slug)) {
    throw new BlogTaxonomyError(
      `${label} slug is invalid. Use letters, numbers, and hyphens.`,
    );
  }
}

function hasSameName(left: string, right: string) {
  return left.trim().toLocaleLowerCase() === right.trim().toLocaleLowerCase();
}

export function parseTagNames(value: unknown) {
  const tagsText = getOptionalString(value);

  if (!tagsText) {
    return [];
  }

  const tagNames = tagsText
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  return Array.from(new Set(tagNames));
}

export function formatTagsText(tags: BlogTagSummary[]) {
  return tags.map((tag) => tag.name).join(", ");
}

export async function getOrCreateBlogCategory(input: {
  name: unknown;
  slug?: unknown;
}) {
  const name = getOptionalString(input.name);

  if (!name) {
    return null;
  }

  const slug = normalizeSlug(getOptionalString(input.slug) || name);
  assertUsableSlug(slug, "Category");

  const existingCategory = await prisma.blogCategory.findUnique({
    where: {
      slug,
    },
  });

  if (existingCategory) {
    if (!hasSameName(existingCategory.name, name)) {
      throw new BlogTaxonomyError(
        `Category slug "${slug}" is already used by "${existingCategory.name}".`,
      );
    }

    return existingCategory;
  }

  return prisma.blogCategory.create({
    data: {
      name,
      slug,
    },
  });
}

export async function getOrCreateBlogTags(value: unknown) {
  const tagNames = parseTagNames(value);
  const tags = [];
  const usedSlugs = new Set<string>();

  for (const name of tagNames) {
    const slug = normalizeSlug(name);
    assertUsableSlug(slug, "Tag");

    if (usedSlugs.has(slug)) {
      continue;
    }

    usedSlugs.add(slug);

    const existingTag = await prisma.blogTag.findUnique({
      where: {
        slug,
      },
    });

    if (existingTag) {
      if (!hasSameName(existingTag.name, name)) {
        throw new BlogTaxonomyError(
          `Tag slug "${slug}" is already used by "${existingTag.name}".`,
        );
      }

      tags.push(existingTag);
      continue;
    }

    const tag = await prisma.blogTag.create({
      data: {
        name,
        slug,
      },
    });

    tags.push(tag);
  }

  return tags;
}
