import { Prisma } from '@prisma/client';

export const UserDataType = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    email: true,
    name: true,
    id: true,
    createdAt: true,
    updatedAt: true,
  },
});
