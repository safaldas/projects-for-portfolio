import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception.filter';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(
    session({
      saveUninitialized: false,
      secret: 'sup3rs3cr3tkjnkjnkjnkjnljn98098u09n',
      resave: false,
      cookie: {
        sameSite: true,
        httpOnly: false,
        maxAge: 160000,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Project portfolio')
    .setDescription('Api docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  );

  await app.listen(3333);
}
bootstrap();
