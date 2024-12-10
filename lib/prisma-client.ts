/**
 * Provides a singleton instance of the Prisma client for interacting with the database.
 * 
 * The Prisma client is initialized with the global `prisma` object if it exists, or a new instance is created if it does not.
 * 
 * If the application is not running in production mode, the global `prisma` object is updated with the new instance.
 * 
 * This module exports the `prisma` instance, which can be used throughout the application to interact with the database.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;