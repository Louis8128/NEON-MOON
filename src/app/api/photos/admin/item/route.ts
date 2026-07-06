import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSessionRequest } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type PhotoItemRequestBody = {
  id?: number | string;
};

export async function POST(request: NextRequest) {
  try {
    if (!(await isValidAdminSessionRequest(request))) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as PhotoItemRequestBody;

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
