import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client to prevent hot-reload issues in development
export const prisma: PrismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
