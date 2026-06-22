import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

function getImageExtension(mimeType: string) {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const location = formData.get("location");
    const description = formData.get("description");
    const takenAt = formData.get("takenAt");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required." },
        { status: 400 },
      );
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image file is too large. Maximum size is 8MB." },
        { status: 400 },
      );
    }

    const extension = getImageExtension(file.type);

    if (!extension) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WEBP images are supported." },
        { status: 400 },
      );
    }

    const fileName = `${randomUUID()}.${extension}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "photos");
    const filePath = join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/photos/${fileName}`;

    const parsedTakenAt =
      typeof takenAt === "string" && takenAt ? new Date(takenAt) : null;

    const photo = await prisma.photo.create({
      data: {
        title: title.trim(),
        imageUrl,
        location:
          typeof location === "string" && location.trim()
            ? location.trim()
            : null,
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        takenAt:
          parsedTakenAt && !Number.isNaN(parsedTakenAt.getTime())
            ? parsedTakenAt
            : null,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Failed to upload photo:", error);

    return NextResponse.json(
      { error: "Failed to upload photo." },
      { status: 500 },
    );
  }
}
