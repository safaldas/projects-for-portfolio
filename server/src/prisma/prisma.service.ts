import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.category.deleteMany(),
      this.tag.deleteMany(),
      this.task.deleteMany(),
      this.project.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
  createWithUser(entity: string, data: any, userId: number) {
    data.createdBy.connect.id = userId;
    return this[entity].create({
      data,
    });
  }
}

// @Injectable()
// export abstract class BaseService extends PrismaService {
//   constructor(private readonly prismaService: PrismaService) {
//     super({});
//   }

// }
