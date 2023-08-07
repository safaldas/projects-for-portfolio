# Projects portfolio backend application

## Stack

Nestjs
postgres
docker
prisma

## Prerequisites

setup docker and start it

## Installation

```bash
$ npm run  install
```

## Running the app

make a copy of `.env.test` as `.env`` and

```bash
# for db setup and rebuild
yarn run db:dev:restart
yarn run db:test:restart # for e2e development

# for db start
yarn run db:dev:up

# development
$ yarn run start:dev

http://localhost:3333

# production mode
$ yarn run build
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e:watch

```

## Swagger Docs

the api documentation is in http://localhost:3333/api

# TODO

createdby and updatedby is needed
