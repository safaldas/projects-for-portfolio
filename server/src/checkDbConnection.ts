import { PrismaClient } from '@prisma/client';

async function checkDatabaseConnection(): Promise<boolean> {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    return true; // Database connection successful
  } catch (error) {
    console.error('Database connection error:', error);
    return false; // Database connection failed
  } finally {
    await prisma.$disconnect();
  }
}

export default checkDatabaseConnection;
