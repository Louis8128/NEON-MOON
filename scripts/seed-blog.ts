import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({ adapter });

async function main() {
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

  const count = await prisma.blogPost.count();

  console.log(`Seed completed. ${count} blog posts inserted.`);
}

main()
  .catch((error) => {
    console.error("Blog seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
