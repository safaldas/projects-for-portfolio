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
    if (process.env.NODE_ENV === 'production') return;
    return this.$transaction([
      this.category.deleteMany(),
      this.tag.deleteMany(),
      this.task.deleteMany(),
      this.project.deleteMany(),
      this.user.deleteMany(),
      this.userTask.deleteMany(),
    ]);
  }
  createWithUser(entity: string, data: any, userId: number) {
    data.createdBy.connect.id = userId;
    return this[entity].create({
      data,
    });
  }
}
