import { PrismaClient } from '@prisma/client';

// PrismaClient est attaché au scope global en développement pour éviter
// de multiples instances de Prisma Client en développement hot-reloading
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
