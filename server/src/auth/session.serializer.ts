import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  serializeUser(
    user: User,
    done: (err: Error, user: { id: number; email: string }) => void,
  ): any {
    done(null, user);
  }
  async deserializeUser(
    payload: { id: number; email: string },
    done: (err: Error, user: Omit<User, 'password'>) => void,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    done(null, user);
  }
}
