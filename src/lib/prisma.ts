import { PrismaClient } from "@prisma/client";

// This prevents Prisma from creating too many connections in a serverless environment,
// especially during development with Next.js hot-reloading.
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
