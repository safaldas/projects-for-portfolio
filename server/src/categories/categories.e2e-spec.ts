import * as pactum from 'pactum';
import { app } from '../../test/app.e2e-spec';

describe('CatgoriessController (e2e)', () => {
  app;

  it('/api should return ok', () => {
    return pactum
      .spec()
      .get('/')

      .expectStatus(200);
  });
});

describe('Auth', () => {
  describe('Categories', () => {
    it('should throw exception if name is empty', () => {
      return pactum
        .spec()
        .post('/category')
        .withCookies('$S{authcookie}')
        .expectStatus(400);
    });

    it('should create a category', () => {
      return pactum
        .spec()
        .post('/category')
        .withCookies('$S{authcookie}')
        .withBody({ name: 'Category 1' })
        .stores('categoryid', 'id')
        .expectStatus(201);
    });

    it('should get a category', () => {
      return pactum
        .spec()
        .get('/category/{id}')
        .withPathParams('id', `$S{categoryid}`)
        .withCookies('$S{authcookie}')
        .expectStatus(200);
    });

    it('should fail trying to get a category with an invalid id', () => {
      return pactum
        .spec()
        .get('/category/{id}')
        .withPathParams('id', 'junk')
        .withCookies('$S{authcookie}')
        .expectStatus(400);
    });

    it('should fail when trying to update a category with no id', () => {
      return pactum
        .spec()
        .withCookies('$S{authcookie}')
        .patch('/category/{id}')
        .withPathParams('id', `$S{categoryid}`)
        .withBody({ name: 'Category 2' })
        .expectBody({ id: `$S{categoryid}`, name: 'Category 2' })
        .expectStatus(200);
    });

    it('should update a category', () => {
      return pactum
        .spec()
        .withCookies('$S{authcookie}')
        .patch('/category/{id}')
        .withPathParams('id', `$S{categoryid}`)
        .withBody({ name: 'Category 2' })
        .expectBody({ id: `$S{categoryid}`, name: 'Category 2' })
        .expectStatus(200);
    });

    it('should delete a category', () => {
      return pactum
        .spec()
        .withCookies('$S{authcookie}')
        .delete('/category/{id}')
        .withPathParams('id', `$S{categoryid}`)
        .expectStatus(204);
    });

    it('should fail trying to get the previous category', () => {
      return pactum
        .spec()
        .get('/category/{id}')
        .withPathParams('id', `$S{categoryid}`)
        .withCookies('$S{authcookie}')
        .expectStatus(404);
    });
    it('should return a list of category with pagination', async () => {
      await pactum
        .spec()
        .post('/category')
        .withCookies('$S{authcookie}')
        .withBody({ name: 'Category 1' })
        .stores('categoryid', 'id')
        .expectStatus(201);
      await pactum
        .spec()
        .get('/category')
        .withCookies('$S{authcookie}')
        .withQueryParams({
          page: 1,
          limit: 10,
        })
        .expectStatus(200)
        .expectJson('data.0.name', 'Category 1')
        .expectJson('meta', {
          page: 1,
          limit: 10,
          totalItems: 1,
        });
    });

    it('should return a list of category with pagination and filter', async () => {
      await pactum
        .spec()
        .get('/category')
        .withCookies('$S{authcookie}')
        .withQueryParams({
          page: 1,
          limit: 10,
          // name: 'Category 1',
          q: 'Category 1',
        })
        .expectStatus(200)
        .expectJson('data.0.name', 'Category 1')
        .expectJson('meta', {
          page: 1,
          limit: 10,
          totalItems: 1,
        })
        .end();
    });
    it('should return a empty list of category with filter for data not in description or name', async () => {
      pactum
        .spec()
        .get('/category')
        .withCookies('$S{authcookie}')
        .withQueryParams({
          q: 'Task',
        })
        .expectStatus(200)
        .expectJsonLength('data', 0)
        .expectJson('meta', {
          page: 1,
          limit: 10,
          totalItems: 0,
        })
        .end();
    });
    it('should delete a category', () => {
      return pactum
        .spec()
        .withCookies('$S{authcookie}')
        .delete('/category/{id}')
        .withPathParams('id', `$S{categoryid}`)
        .expectStatus(204);
    });
  });
  // end category
});
