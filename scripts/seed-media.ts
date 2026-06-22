import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { MediaCategory, PrismaClient } from "@prisma/client";

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

  const count = await prisma.mediaItem.count();

  console.log(`Seed completed. ${count} media items inserted.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
