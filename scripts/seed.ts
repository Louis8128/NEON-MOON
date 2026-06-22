import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { MediaCategory, PrismaClient } from "@prisma/client";

// Read required database settings from .env and fail early if any value is missing.
// 读取 .env，提前发现数据库配置缺失。
function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

// This script runs outside the Next.js app, so it creates its own Prisma Client.
// seed 脚本独立运行，需要自己创建 Prisma Client。
const adapter = new PrismaMariaDb({
  host: getRequiredEnv("DATABASE_HOST"),
  port: Number(getRequiredEnv("DATABASE_PORT")),
  user: getRequiredEnv("DATABASE_USER"),
  password: getRequiredEnv("DATABASE_PASSWORD"),
  database: getRequiredEnv("DATABASE_NAME"),
  connectionLimit: 5,

  // Required for the local Docker MySQL 8 setup when using this adapter.
  // 允许本地开发环境获取 MySQL RSA 公钥。
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({ adapter });

// Reset and insert sample MediaItem records for the media library.
// 重置媒体测试数据。
async function seedMediaItems() {
  await prisma.mediaItem.deleteMany();

  await prisma.mediaItem.createMany({
    data: [
      {
        title: "Interstellar",
        category: MediaCategory.MOVIE,
        creator: "Christopher Nolan",
        releaseYear: 2014,
        coverUrl: "/covers/interstellar.jpg",
        rating: 9.5,
        note: "A science fiction film about time, love, space, and survival.",
      },
      {
        title: "The Dark Side of the Moon",
        category: MediaCategory.MUSIC,
        creator: "Pink Floyd",
        releaseYear: 1973,
        coverUrl: "/covers/dark-side-of-the-moon.jpg",
        rating: 9.7,
        note: "A classic progressive rock album with a strong sense of atmosphere and structure.",
      },
      {
        title: "Norwegian Wood",
        category: MediaCategory.BOOK,
        creator: "Haruki Murakami",
        releaseYear: 1987,
        coverUrl: "/covers/norwegian-wood.jpg",
        rating: 8.6,
        note: "A quiet, emotional novel about memory, youth, and loss.",
      },
      {
        title: "Cyberpunk: Edgerunners",
        category: MediaCategory.ANIME,
        creator: "Studio Trigger",
        releaseYear: 2022,
        coverUrl: "/covers/cyberpunk-edgerunners.jpg",
        rating: 9.0,
        note: "A stylish and intense anime about ambition, technology, and survival.",
      },
      {
        title: "The Legend of Zelda: Breath of the Wild",
        category: MediaCategory.GAME,
        creator: "Nintendo",
        releaseYear: 2017,
        coverUrl: "/covers/breath-of-the-wild.jpg",
        rating: 9.8,
        note: "An open-world adventure game built around freedom, exploration, and discovery.",
      },
    ],
  });
}

// Reset and insert sample BlogPost records for the blog list and dynamic detail pages.
// 重置博客测试数据，用于 /blog 和 /blog/[slug]。
async function seedBlogPosts() {
  await prisma.blogPost.deleteMany();

  await prisma.blogPost.createMany({
    data: [
      {
        title: "Building NEON MOON",
        slug: "building-neon-moon",
        excerpt:
          "A short reflection on building a personal full-stack website with Next.js, MySQL, Docker, and Prisma.",
        content:
          "NEON MOON started as a small personal website idea. The goal is to build a space for blogs, music notes, photos, and personal projects. This post records the early development process.",
        coverImageUrl: "/blog/building-neon-moon.jpg",
        published: true,
      },
      {
        title: "Why I Like Personal Websites",
        slug: "why-i-like-personal-websites",
        excerpt:
          "Personal websites feel slower, quieter, and more intentional than social media platforms.",
        content:
          "A personal website is not only a portfolio. It can also be a personal archive. Unlike social media, it does not need to chase constant updates or platform trends.",
        coverImageUrl: "/blog/personal-websites.jpg",
        published: true,
      },
      {
        title: "Notes on Music and Memory",
        slug: "notes-on-music-and-memory",
        excerpt:
          "Some albums are not just entertainment. They become markers of time, place, and memory.",
        content:
          "Music often works like a timestamp. A song can bring back a room, a season, a walk, or a specific period of life. This post is a placeholder for future music essays.",
        coverImageUrl: "/blog/music-and-memory.jpg",
        published: true,
      },
    ],
  });
}

// Reset and insert sample Photo records for the photo archive page.
// 重置照片测试数据，用于 /photos。
async function seedPhotos() {
  await prisma.photo.deleteMany();

  await prisma.photo.createMany({
    data: [
      {
        title: "Tokyo Night Street",
        imageUrl: "/photos/tokyo-night-street.jpg",
        location: "Tokyo, Japan",
        description:
          "A night street scene with neon lights, quiet corners, and city movement.",
        takenAt: new Date("2026-01-12"),
      },
      {
        title: "Brisbane River Walk",
        imageUrl: "/photos/brisbane-river-walk.jpg",
        location: "Brisbane, Australia",
        description:
          "A calm walk near the river, with warm light and open sky.",
        takenAt: new Date("2026-03-20"),
      },
      {
        title: "Coffee and Notes",
        imageUrl: "/photos/coffee-and-notes.jpg",
        location: "Home Desk",
        description:
          "A simple desk moment with coffee, notes, and unfinished ideas.",
        takenAt: new Date("2026-05-08"),
      },
      {
        title: "Train Window",
        imageUrl: "/photos/train-window.jpg",
        location: "Somewhere in transit",
        description:
          "A view from a train window, somewhere between leaving and arriving.",
        takenAt: new Date("2026-06-02"),
      },
    ],
  });
}

async function main() {
  console.log("Seeding database...");

  // Run each seed step in a controlled order.
  // 按顺序重置三张表的测试数据。
  await seedMediaItems();
  await seedBlogPosts();
  await seedPhotos();

  // Count inserted records as a simple success check.
  // 中文关键词：统计插入结果，确认 seed 是否成功。
  const mediaCount = await prisma.mediaItem.count();
  const blogCount = await prisma.blogPost.count();
  const photoCount = await prisma.photo.count();

  console.log("Seed completed.");
  console.log(`Media items: ${mediaCount}`);
  console.log(`Blog posts: ${blogCount}`);
  console.log(`Photos: ${photoCount}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    // Always close the database connection when the script finishes.
    // 脚本结束后断开数据库连接。
    await prisma.$disconnect();
  });
