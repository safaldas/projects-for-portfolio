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
      .withPathParams('id', `$S{tagid}`)
      .withBody({ name: 'Tag 2' })
      .expectBody({ id: `$S{tagid}`, name: 'Tag 2' })
      .expectStatus(200);
  });

  it('should update a tag ', () => {
    return pactum
      .spec()
      .withCookies('$S{authcookie}')
      .patch('/tags/{id}')
      .withPathParams('id', `$S{tagid}`)
      .withBody({ name: 'Tag 2' })
      .expectBody({ id: `$S{tagid}`, name: 'Tag 2' })
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
});
