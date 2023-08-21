import * as pactum from 'pactum';
import { app } from '../../test/app.e2e-spec';

describe('TasksController (e2e)', () => {
  app;

  describe('Error handling', () => {
    it('should return 400 for invalid ID', async () => {
      await pactum
        .spec()
        .withCookies('$S{authcookie}')

        .get('/tasks/invalid')
        .expectStatus(400)
        .expectBodyContains('Invalid id parameter');
    });

    it('should return 404 for non-existent task', async () => {
      await pactum
        .spec()
        .get('/tasks/999')
        .withCookies('$S{authcookie}')

        .expectStatus(404)
        .expectBodyContains('Not Found');
    });

    it('should return 400 for missing name field when creating task', async () => {
      await pactum
        .spec()
        .post('/tasks')
        .withCookies('$S{authcookie}')
        .withBody({
          projectId: 1,
        })
        .expectStatus(400);
    });

    it('should return 400 for empty task name', async () => {
      await pactum
        .spec()
        .post('/tasks')
        .withCookies('$S{authcookie}')

        .withBody({
          name: '',
        })
        .expectStatus(400)
        .expectBodyContains('name should not be empty');
    });

    it('should return 400 for invalid project ID', async () => {
      await pactum
        .spec()
        .post('/tasks')
        .withCookies('$S{authcookie}')

        .withBody({
          name: 'Task 1',
          projectId: 'invalid',
        })
        .expectStatus(400)
        .expectBodyContains('projectId must be a number');
    });

    it('should return 403 for missing authentication', async () => {
      await pactum
        .spec()
        .get('/tasks')
        .expectStatus(403)
        .expectBodyContains('Forbidden resource');
    });

    it('should fail when creating a new task with non existent project id', async () => {
      await pactum
        .spec()
        .post('/tasks')
        .withCookies('$S{authcookie}')

        .withBody({
          name: 'My task',
          projectId: 1,
        })
        .expectStatus(400);
    });

    describe('Authorization for Updating and Deleting', () => {
      it('should return 403 for unauthorized task update', async () => {
        await pactum
          .spec()
          .patch('/tasks/{id}')
          .withPathParams('id', '$S{taskid}')
          .expectStatus(403);
      });

      it('should return 403 for unauthorized task deletion', async () => {
        await pactum
          .spec()
          .delete('/tasks/{id}')
          .withPathParams('id', '$S{taskid}')
          .expectStatus(403);
      });
    });
  });

  describe('Tasks Crud', () => {
    it('should create a new task', async () => {
      await pactum
        .spec()
        .post('/category')
        .withCookies('$S{authcookie}')
        .withBody({ name: 'Category 1' })
        .stores('categoryid', 'id')
        .expectStatus(201);

      await pactum
        .spec()
        .post('/projects')
        .withCookies('$S{authcookie}')
        .withBody({
          name: 'Test Project for tasks',
          description: 'Test description',
          categories: [`$S{categoryid}`],
        })
        .stores('projectid', 'id')
        .expectStatus(201);

      return await pactum
        .spec()
        .post('/tasks')
        .withCookies('$S{authcookie}')
        .withBody({
          name: 'My task',
          projectId: '$S{projectid}',
        })
        .expectStatus(201)
        .stores('taskid', 'id')
        .expectBodyContains('id')
        .expectJson('createdBy', '$S{userid}')
        .expectBodyContains('My task');
    });
    describe('Pagination of Tasks', () => {
      it('should return a list of tasks with pagination', async () => {
        await pactum
          .spec()
          .get('/tasks')
          .withCookies('$S{authcookie}')
          .withQueryParams({
            page: 1,
            limit: 10,
          })
          .expectStatus(200)
          .expectJson('data.0.name', 'My task')
          .expectJson('meta', {
            page: 1,
            limit: 10,
            totalItems: 1,
          });
      });

      it('should return a list of tasks with pagination and filter', async () => {
        await pactum
          .spec()
          .get('/tasks')
          .withCookies('$S{authcookie}')
          .withQueryParams({
            page: 1,
            limit: 10,
            name: 'My task',
            // You can add other filter parameters here
          })
          .expectStatus(200)
          .expectJson('data.0.name', 'My task')
          .expectJson('meta', {
            page: 1,
            limit: 10,
            totalItems: 1,
          });
      });

      it('should return an empty list of tasks with filter for data not in name', async () => {
        await pactum
          .spec()
          .get('/tasks')
          .withCookies('$S{authcookie}')
          .withQueryParams({
            name: 'Non-existent Task',
            page: 1,
            limit: 10,
          })
          .expectStatus(200)
          .expectJsonLength('data', 0)
          .expectJson('meta', {
            page: 1,
            limit: 10,
            totalItems: 0,
          });
      });
    });
    it('should get a task by ID', async () => {
      await pactum
        .spec()
        .get('/tasks/{id}')
        .withCookies('$S{authcookie}')

        .withPathParams('id', '$S{taskid}')
        .expectStatus(200)
        .expectBodyContains('$S{taskid}');
    });

    it('should update a task', async () => {
      await pactum
        .spec()
        .withCookies('$S{authcookie}')

        .patch('/tasks/{id}')
        .withPathParams('id', '$S{taskid}')
        .withBody({
          name: 'Updated name',
        })
        .expectStatus(200)
        .expectBodyContains('Updated name');
    });

    it('should delete a task', async () => {
      await pactum
        .spec()
        .withCookies('$S{authcookie}')

        .delete('/tasks/{id}')
        .withPathParams('id', '$S{taskid}')
        .expectStatus(204);
    });

    it('should delete a project and associated tasks', async () => {
      // Create a project and associate tasks
      await pactum
        .spec()
        .post('/projects')
        .withCookies('$S{authcookie}')
        .withBody({
          name: 'Test Project for tasks',
          description: 'Test description',
          categories: [`$S{categoryid}`],
        })
        .stores('projectid', 'id')
        .expectStatus(201);

      await pactum
        .spec()
        .post('/tasks')
        .withCookies('$S{authcookie}')
        .withBody({
          name: 'Task for Deletion',
          projectId: '$S{projectid}',
        })
        .expectStatus(201)
        .stores('taskid', 'id')
        .expectBodyContains('id')
        .expectBodyContains('Task for Deletion');

      // Delete the project
      await pactum
        .spec()
        .withCookies('$S{authcookie}')
        .delete('/projects/{id}')
        .withPathParams('id', '$S{projectid}')
        .expectStatus(204);

      // Verify associated task is deleted or not present in the database
      await pactum
        .spec()
        .get('/tasks/$S{taskid}')
        .withCookies('$S{authcookie}')
        .expectStatus(404);
      // ...
    });
  });
});
