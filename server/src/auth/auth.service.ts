import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      // generate pass
      const hash = await argon.hash(dto.password);
      // save user
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash, name: dto.name },
      });
      delete user.hash;
      // return new user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002') {
          throw new ForbiddenException('User exists');
        }
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid Credentials');
    }

    // compare password

    const pwMatches = argon.verify(user.hash, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Invalid Credentials');
    }
    delete user.hash;
    return user;
  }

  async validateUser(email, password): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      const pwMatches = argon.verify(user.hash, password);
      if (pwMatches) {
        const { hash: hash, ...retUser } = user;
        return retUser;
      } else {
        throw new UnauthorizedException('Incorrect username or password');
      }
    } else {
      throw new UnauthorizedException('Incorrect username or password');
    }
  }
}
