import { Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { REDIS, RedisModule } from './redis/redis.module';
import { ProjectsModule } from './projects/projects.module';
import { TagsModule } from './tags/tags.module';
import RedisStore from 'connect-redis';
import passport from 'passport';
import session from 'express-session';
import { RedisClientType } from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    RedisModule,
    ProjectsModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(@Inject(REDIS) private readonly redis: RedisClientType) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          // used to be new (RedisStore(session))({ client: this.redis, logErrors: true }),
          store: new RedisStore({ client: this.redis }),
          saveUninitialized: false,
          secret: 'sup3rs3cr3tkjnkjnkjnkjnljn98098u09n',
          resave: false,
          cookie: {
            sameSite: true,
            httpOnly: false,
            maxAge: 60000,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
