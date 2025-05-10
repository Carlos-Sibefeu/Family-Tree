import { PrismaClient } from '@prisma/client';

// Déclaration pour éviter les multiples instances de Prisma Client en développement
declare global {
  var prisma: PrismaClient | undefined;
}

// Utiliser une instance globale de Prisma Client pour éviter les problèmes de connexions multiples en développement
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
