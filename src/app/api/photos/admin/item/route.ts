import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type PhotoItemRequestBody = {
  adminPassword?: string;
  id?: number | string;
};

function getExpectedAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? process.env.ADMIN_UPLOAD_PASSWORD;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PhotoItemRequestBody;
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

    const photo = await prisma.photo.findUnique({
      where: {
        id: photoId,
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

    if (!photo) {
      return NextResponse.json(
        {
          error: "Photo not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      photo,
    });
  } catch (error) {
    console.error("Failed to load photo admin item:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while loading the photo.",
      },
      { status: 500 },
    );
  }
}
