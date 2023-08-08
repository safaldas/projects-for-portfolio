import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from '../src/prisma/prisma-client-exception.filter';
import session from 'express-session';
import { RefreshSessionMiddleware } from '../src/common/middlewares';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { SigninDto, SignupDto } from '../src/auth/dto';

export let app: INestApplication;
const port = 3331;
let prisma: PrismaService;
beforeAll(async () => {
  if (app) await app.close();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(
    session({
      saveUninitialized: false,
      secret: 'sup3rs3cr3tkjnkjnkjnkjnljn98098u09n',
      resave: false,
      cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  );
  app.use(new RefreshSessionMiddleware().use);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  );
  await app.init();

  await app.listen(port);

  prisma = app.get(PrismaService);
  await prisma.cleanDb();
  pactum.request.setBaseUrl(`http://localhost:${port}`);
});
describe('AppController (e2e)', () => {
  describe('App', () => {
    it('/api should return ok', () => {
      return pactum
        .spec()
        .get('/')

        .expectStatus(200);
    });
  });

  describe('Auth', () => {
    const signupDto: SignupDto = {
      email: 'Safal@gmail.com',
      name: 'Safal',
      password: '123',
    };
    const loginDto: Partial<SigninDto> = {
      email: 'Safal@gmail.com',
      password: '123',
    };
    describe('Sigup', () => {
      it('should throw exception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: signupDto.password,
          })
          .expectStatus(400);
      });
      it('should throw exception if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: signupDto.email,
          })
          .expectStatus(400);
      });
      it('should throw exception if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw exception if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: loginDto.password,
          })
          .expectStatus(401);
      });
      it('should throw exception if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: loginDto.email,
          })
          .expectStatus(401);
      });
      it('should signin', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(loginDto)
          .expectStatus(200)
          .stores('authcookie', 'res.headers.set-cookie[0]');
      });
      // });
    });
    // end signin
  });
});

afterAll(async () => {
  await app.close();
  await app.close();
});
