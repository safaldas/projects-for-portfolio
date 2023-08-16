import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './prisma/prisma-client-exception.filter';
import session from 'express-session';
import { RefreshSessionMiddleware } from './common/middlewares';
import checkDatabaseConnection from './checkDbConnection';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const isDatabaseConnected = await checkDatabaseConnection();
  const logger = new Logger('App: main');
  if (isDatabaseConnected) {
    const app = await NestFactory.create(AppModule);

    const corsOptions: CorsOptions = {
      origin: 'http://localhost:5173', // Replace with your frontend's URL
      credentials: true, // Enable cookies
    };

    // app.enableCors();
    app.enableCors(corsOptions);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.use(
      session({
        secret: 'sup3rs3cr3tkjnkjnkjnkjnljn98098u09n',
        resave: true,
        saveUninitialized: true,
        cookie: {
          secure: false,
          httpOnly: false,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      }),
    );
    app.use(new RefreshSessionMiddleware().use);

    const config = new DocumentBuilder()
      .setTitle('Project portfolio')
      .setDescription('Api docs')
      .setVersion('1.0')
      .addCookieAuth()
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
  } else {
    logger.error(
      'Database is not available. Nest application not started. Run the docker service first and run "npm run db:dev:up"',
    );
    process.exit(1);
  }
}
bootstrap();
