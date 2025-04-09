import { PrismaClient } from "@prisma/client"

// PrismaClient is attached to the `global` object
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

export default db
