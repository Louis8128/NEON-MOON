import { unlink } from "fs/promises";
import { isAbsolute, relative, resolve } from "path";
import { NextRequest, NextResponse } from "next/server";
import {
  isAuthorizedAdminRequest,
  readAdminJsonRequestBody,
} from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type PhotoDeleteRequestBody = {
  adminPassword?: string;
  id?: number | string;
};

async function deleteUploadedPhotoFile(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/photos/")) {
    return;
  }

  const uploadDir = resolve(process.cwd(), "public", "uploads", "photos");
  const relativeUploadPath = imageUrl.slice("/uploads/photos/".length);
  const filePath = resolve(uploadDir, relativeUploadPath);
  const relativeFilePath = relative(uploadDir, filePath);

  // Only remove files that still resolve inside public/uploads/photos.
  // 只允许删除上传目录内部的文件，防止路径穿越。
  if (
    !relativeFilePath ||
    relativeFilePath.startsWith("..") ||
    isAbsolute(relativeFilePath)
  ) {
    console.warn("Skipped deleting unsafe uploaded photo path:", imageUrl);
    return;
  }

  try {
    await unlink(filePath);
  } catch (error) {
    console.warn("Failed to delete uploaded photo file:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body =
      (await readAdminJsonRequestBody(request)) as
        | PhotoDeleteRequestBody
        | null;

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

    await prisma.photo.delete({
      where: {
        id: photoId,
      },
    });

    await deleteUploadedPhotoFile(photo.imageUrl);

    return NextResponse.json({
      success: true,
      deletedPhoto: photo,
    });
  } catch (error) {
    console.error("Failed to delete photo admin item:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while deleting the photo.",
      },
      { status: 500 },
    );
  }
}
