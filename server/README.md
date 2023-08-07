# Projects portfolio backend application

## Stack

Nestjs
postgres
docker
prisma

## Prerequisites

setup docker

## Installation

```bash
$ npm run  install
```

## Running the app

make a copy of `.env.test` as `.env`` and

```bash
# for db setup and rebuild
yarn run db:dev:restart

# for db start
yarn run db:dev:up

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run build
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

# TODO

pagination service to support partial search, sorting, addition fields for newer models

createdby and updatedby is needed

find a way to run tests with session. maybe e2e is the way.
