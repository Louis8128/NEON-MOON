import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Run this API route in the Node.js runtime because Prisma needs a server-side environment.
// API Route 使用 Node.js 运行环境，方便连接数据库。
export const runtime = "nodejs";

export async function GET() {
  try {
    // Fetch all media records from MySQL through Prisma.
    // Newer records are returned first.
    // API 接口读取 MediaItem 表。
    const mediaItems = await prisma.mediaItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return database records as JSON for browser/client-side usage.
    // 把数据库结果返回成 JSON。
    return NextResponse.json(mediaItems);
  } catch (error) {
    console.error("Failed to fetch media items:", error);

    // Return a safe error response instead of exposing internal database details.
    // 接口错误处理，避免暴露内部错误细节。
    return NextResponse.json(
      { error: "Failed to fetch media items" },
      { status: 500 },
    );
  }
}
