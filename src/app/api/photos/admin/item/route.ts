import { NextRequest, NextResponse } from "next/server";
import {
  isAuthorizedAdminRequest,
  readAdminJsonRequestBody,
} from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type PhotoItemRequestBody = {
  adminPassword?: string;
  id?: number | string;
};

export async function POST(request: NextRequest) {
  try {
    const body =
      (await readAdminJsonRequestBody(request)) as PhotoItemRequestBody | null;

    if (!(await isAuthorizedAdminRequest(request, body?.adminPassword))) {
      return NextResponse.json(
        {
          error: "Invalid admin password.",
        },
        { status: 401 },
      );
    }

    if (!body) {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 },
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
