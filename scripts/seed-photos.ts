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

  const count = await prisma.photo.count();

  console.log(`Seed completed. ${count} photos inserted.`);
}

main()
  .catch((error) => {
    console.error("Photo seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
