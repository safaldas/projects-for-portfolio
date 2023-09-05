import { Logger } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const logger = new Logger();
async function main() {
  logger.log('Seeding database');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@application.com' },
    update: {},
    create: {
      email: 'admin@application.com',
      name: 'Admin',
      role: Role.ADMIN,
      hash: '$argon2id$v=19$m=65536,t=3,p=4$klB1o6omNICyPg8jvb9q9Q$BDprpmHgPIn3EMxdjtA+RKSA0ZGESFAaZbpDaLW8nnY',
    },
  });

  logger.log('Admin created', { admin });
  logger.log('Seeding database done ');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
