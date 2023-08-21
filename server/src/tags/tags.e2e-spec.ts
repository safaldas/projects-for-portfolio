import * as pactum from 'pactum';
import { app } from '../../test/app.e2e-spec';

describe('TagsController (e2e)', () => {
  app;

  it('should throw exception if name empty', () => {
    return pactum
      .spec()
      .post('/tags')
      .withCookies('$S{authcookie}')
      .expectStatus(400);
  });

  it('should create a tag ', () => {
    return pactum
      .spec()
      .post('/tags')
      .withCookies('$S{authcookie}')
      .withBody({ name: 'Tag 1' })
      .stores('tagid', 'id')
      .expectJson('createdBy', '$S{userid}')
      .expectStatus(201);
  });
  it('should get a tag ', () => {
    return pactum
      .spec()
      .get('/tags/{id}')
      .withPathParams('id', `$S{tagid}`)
      .withCookies('$S{authcookie}')
      .expectStatus(200);
  });
  it('should fail trying to get a string aa tag id', () => {
    return pactum
      .spec()
      .get('/tags/{id}')
      .withPathParams('id', `junk`)
      .withCookies('$S{authcookie}')
      .expectStatus(400);
  });
  it('should fail when trying to update a tag with no id', () => {
    return pactum
      .spec()
      .withCookies('$S{authcookie}')
      .patch('/tags/{id}')
      .withPathParams('id', 2232323)
      .withBody({ name: 'Tag 2' })
      .expectStatus(404);
  });

  it('should update a tag ', () => {
    return pactum
      .spec()
      .withCookies('$S{authcookie}')
      .patch('/tags/{id}')
      .withPathParams('id', `$S{tagid}`)
      .withBody({ name: 'Tag 2' })
      .expectJsonLike({ id: `$S{tagid}`, name: 'Tag 2' })
      .expectStatus(200);
  });
  it('should delete a tag ', () => {
    return pactum
      .spec()
      .withCookies('$S{authcookie}')
      .delete('/tags/{id}')
      .withPathParams('id', `$S{tagid}`)
      .expectStatus(204);
  });

  it('should fail trying to get the previous tag ', () => {
    return pactum
      .spec()
      .get('/tags/{id}')
      .withPathParams('id', `$S{tagid}`)
      .withCookies('$S{authcookie}')
      .expectStatus(404);
  });

  it('should throw error when pagination page is less than 1', async () => {
    await pactum
      .spec()
      .get('/tags')
      .withCookies('$S{authcookie}')
      .withQueryParams({
        page: 0,
        limit: 10,
      })
      .expectStatus(400)
      .expectJson('message.0', 'page must not be less than 1');
  });
  it('should return a list of tags with pagination', async () => {
    await pactum
      .spec()
      .post('/tags')
      .withCookies('$S{authcookie}')
      .withBody({ name: 'tag 1' })
      .expectStatus(201);
    await pactum
      .spec()
      .get('/tags')
      .withCookies('$S{authcookie}')
      .withQueryParams({
        page: 1,
        limit: 10,
      })
      .expectStatus(200)
      .expectJson('data.0.name', 'tag 1')
      .expectJson('meta', {
        page: 1,
        limit: 10,
        totalItems: 1,
      });
  });
});
