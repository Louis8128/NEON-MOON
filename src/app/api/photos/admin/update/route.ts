import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type PhotoUpdateRequestBody = {
  adminPassword?: string;
  id?: number | string;
  title?: string;
  imageUrl?: string;
  location?: string | null;
  description?: string | null;
  takenAt?: string | null;
};

function getExpectedAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? process.env.ADMIN_UPLOAD_PASSWORD;
}

function normalizeOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  return trimmedValue;
}

function parseOptionalDate(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid taken date.");
  }

  return parsedDate;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PhotoUpdateRequestBody;
    const expectedPassword = getExpectedAdminPassword();

    if (!expectedPassword) {
      return NextResponse.json(
        {
          error:
            "Admin password is not configured on the server. Please set ADMIN_PASSWORD or ADMIN_UPLOAD_PASSWORD.",
        },
        { status: 500 },
      );
    }

    if (!body.adminPassword || body.adminPassword !== expectedPassword) {
      return NextResponse.json(
        {
          error: "Invalid admin password.",
        },
        { status: 401 },
      );
    }

    const photoId = Number(body.id);

    if (!Number.isInteger(photoId) || photoId <= 0) {
      return NextResponse.json(
        {
          error: "A valid photo id is required.",
        },
        { status: 400 },
      );
    }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";

    if (!title) {
      return NextResponse.json(
        {
          error: "Photo title is required.",
        },
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        {
          error: "Photo image URL is required.",
        },
        { status: 400 },
      );
    }

    let takenAt: Date | null;

    try {
      takenAt = parseOptionalDate(body.takenAt);
    } catch {
      return NextResponse.json(
        {
          error: "Taken date must be a valid date.",
        },
        { status: 400 },
      );
    }

    const existingPhoto = await prisma.photo.findUnique({
      where: {
        id: photoId,
      },
      select: {
        id: true,
      },
    });

    if (!existingPhoto) {
      return NextResponse.json(
        {
          error: "Photo not found.",
        },
        { status: 404 },
      );
    }

    const updatedPhoto = await prisma.photo.update({
      where: {
        id: photoId,
      },
      data: {
        title,
        imageUrl,
        location: normalizeOptionalText(body.location),
        description: normalizeOptionalText(body.description),
        takenAt,
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        location: true,
        description: true,
        takenAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error("Failed to update photo admin item:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while updating the photo.",
      },
      { status: 500 },
    );
  }
}
