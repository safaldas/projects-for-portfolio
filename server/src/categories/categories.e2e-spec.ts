import * as pactum from 'pactum';
import { app } from '../../test/app.e2e-spec';

describe('Categories', () => {
  app;
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
      .withPathParams('id', 2343)
      .withBody({ name: 'Category 2' })
      .expectStatus(404);
  });

  it('should update a category', () => {
    return pactum
      .spec()
      .withCookies('$S{authcookie}')
      .patch('/category/{id}')
      .withPathParams('id', `$S{categoryid}`)
      .withBody({ name: 'Category 2' })
      .expectJsonLike({
        id: `$S{categoryid}`,
        name: 'Category 2',
        createdBy: '$S{adminid}',
      })
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

  it('should throw error when pagination page is less than 1', async () => {
    await pactum
      .spec()
      .get('/category')
      .withCookies('$S{authcookie}')
      .withQueryParams({
        page: 0,
        limit: 10,
      })
      .expectStatus(400)
      .expectJson('message.0', 'page must not be less than 1');
  });

  it('should return a list of category with pagination', async () => {
    await pactum
      .spec()
      .post('/category')
      .withCookies('$S{authcookie}')
      .withBody({ name: 'Category 1' })
      .stores('categoryid', 'id')
      .expectJson('createdBy', '$S{adminid}')
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
      });
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
      });
  });
  it('should delete a category', () => {
    return pactum
      .spec()
      .withCookies('$S{authcookie}')
      .delete('/category/{id}')
      .withPathParams('id', `$S{categoryid}`)
      .expectStatus(204);
  });
  // write test cases for user where the assserstions are checking failures
  // for create,update,delete and succcess for get requests
  describe('Checking  user role actions on Category', () => {
    // first create one   it('should create a category', () => {
    it('should create a category using auth cookie', () => {
      return pactum
        .spec()
        .post('/category')
        .withCookies('$S{authcookie}')
        .withBody({ name: 'Dummy Cat' })
        .stores('dummycatid', 'id')
        .expectStatus(201);
    });
    it('should fail creating a category using user cookie', () => {
      return pactum
        .spec()
        .withCookies('$S{userauthcookie}')
        .post('/category')
        .withBody({ name: 'Category 1' })
        .expectStatus(403);
    });
    it('should fail when trying to delete a category', () => {
      return pactum
        .spec()
        .withCookies('$S{userauthcookie}')
        .delete('/category/{id}')
        .withPathParams('id', `$S{dummycatid}`)
        .expectStatus(403);
    });
    it('should fail when trying to update the category', () => {
      return pactum
        .spec()
        .withCookies('$S{userauthcookie}')
        .patch('/category/{id}')
        .withPathParams('id', `$S{dummycatid}`)
        .withBody({ name: 'Category 2' })
        .expectStatus(403);
    });
    it('should return a list of category', async () => {
      return pactum
        .spec()
        .get('/category')
        .withCookies('$S{userauthcookie}')
        .expectStatus(200)
        .expectJsonLength('data', 1)
        .expectJson('meta', {
          page: 1,
          limit: 10,
          totalItems: 1,
        });
    });
    it('should return a category', async () => {
      return pactum
        .spec()
        .get('/category/{id}')
        .withCookies('$S{userauthcookie}')
        .withPathParams('id', `$S{dummycatid}`)
        .expectStatus(200);
    });
  });
  // end category
});
