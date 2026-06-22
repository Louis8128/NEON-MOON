import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

// Read a required environment variable and fail early if it is missing.
// 环境变量检查，避免数据库连接信息缺失。
function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

// Prisma 7 connects to MySQL through a driver adapter.
// Prisma 通过 adapter 连接 Docker 里的 MySQL。
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

// Store the Prisma Client on globalThis during development.
// This prevents Next.js hot reload from creating too many database connections.
// 开发模式复用 Prisma Client，避免热更新重复连接数据库。
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

// In development, cache the Prisma Client instance globally.
// In production, avoid relying on a mutable global cache.
// 开发环境缓存，生产环境保持干净。
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
