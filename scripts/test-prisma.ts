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
  await prisma.mediaItem.deleteMany({
    where: {
      title: "Interstellar",
    },
  });

  const movie = await prisma.mediaItem.create({
    data: {
      title: "Interstellar",
      category: MediaCategory.MOVIE,
      creator: "Christopher Nolan",
      releaseYear: 2014,
      coverUrl: "/covers/interstellar.jpg",
      rating: 9.5,
      note: "A science fiction film about time, love, space, and survival.",
    },
  });

  console.log("Created movie:");
  console.log(movie);

  const allMediaItems = await prisma.mediaItem.findMany();

  console.log("All media items:");
  console.log(allMediaItems);
}

main()
  .catch((error) => {
    console.error("Prisma test failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
