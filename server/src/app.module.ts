import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { TagsModule } from './tags/tags.module';
import passport from 'passport';
import { CategoryModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    ProjectsModule,
    TagsModule,
    CategoryModule,
  ],
  exports: [],
  controllers: [],
})
export class AppModule implements NestModule {
  // constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(passport.initialize(), passport.session()).forRoutes('*'); // Apply passport middleware to all routes
  }
}
