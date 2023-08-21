import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { TagsModule } from './tags/tags.module';
import passport from 'passport';
import { CategoryModule } from './categories/categories.module';
import { AppController } from './app.controller';
import { TasksModule } from './tasks/tasks.module';
import { UsertasksModule } from './usertasks/usertasks.module';

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
    TasksModule,
    UsertasksModule,
  ],
  exports: [],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(passport.initialize(), passport.session()).forRoutes('*'); // Apply passport middleware to all routes
  }
}
