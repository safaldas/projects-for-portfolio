import * as pactum from 'pactum';
import { app } from '../../test/app.e2e-spec';

describe('ProjectsController (e2e)', () => {
  app;

  describe('Projects', () => {
    it('should throw exception if name is empty when creating a project', () => {
      return pactum
        .spec()
        .post('/projects')
        .withCookies('$S{authcookie}')
        .expectStatus(400);
    });

    it('should throw exception if category is empty when creating a project', () => {
      return pactum
        .spec()
        .post('/projects')
        .withCookies('$S{authcookie}')
        .withBody({ name: 'Test Project', description: 'Test description' })
        .expectStatus(400)
        .expectBodyContains('categories must be an array');
    });

    it('should create a project', async () => {
      // category is required for project
      await pactum
        .spec()
        .post('/category')
        .withCookies('$S{authcookie}')
        .withBody({ name: 'Category 1' })
        .stores('categoryid', 'id')
        .expectStatus(201);
      // tag is optional
      await pactum
        .spec()
        .post('/tags')
        .withCookies('$S{authcookie}')
        .withBody({ name: 'Tag 1' })
        .stores('tagid', 'id')
        .expectStatus(201);
      await pactum
        .spec()
        .post('/projects')
        .withCookies('$S{authcookie}')
        .withBody({
          name: 'My Awesome Project',
          description: 'This project will do something really cool!',
          users: [10],
          categories: [10],
          tags: [10],
        })
        .stores('dprojectid', 'id')
        .inspect()
        .expectStatus(400);
      return pactum
        .spec()
        .post('/projects')
        .withCookies('$S{authcookie}')
        .withBody({
          name: 'Test Project',
          description: 'Test description',
          categories: [`$S{categoryid}`],
          tags: [`$S{tagid}`],
        })
        .stores('projectid', 'id')
        .expectStatus(201);
    });

    it('should get a project', () => {
      return pactum
        .spec()
        .get('/projects/{id}')
        .withPathParams('id', `$S{projectid}`)
        .withCookies('$S{authcookie}')
        .expectStatus(200);
    });

    it('should handle invalid project ID when getting a project', () => {
      return pactum
        .spec()
        .get('/projects/{id}')
        .withPathParams('id', 'invalid-id')
        .withCookies('$S{authcookie}')
        .expectStatus(400);
    });

    it('should handle non-existent project ID when getting a project', () => {
      return pactum
        .spec()
        .get('/projects/{id}')
        .withPathParams('id', 99999)
        .withCookies('$S{authcookie}')
        .expectStatus(404);
    });

    it('should update a project', () => {
      return pactum
        .spec()
        .withCookies('$S{authcookie}')
        .patch('/projects/{id}')
        .withPathParams('id', `$S{projectid}`)
        .withBody({
          name: 'Updated Project',
          description: 'Updated description',
        })
        .expectJson('id', '$S{projectid}')
        .expectJson('name', 'Updated Project')
        .expectJson('description', 'Updated description')
        .expectStatus(200);
    });

    it('should update a project with user id ', () => {
      return pactum
        .spec()
        .withCookies('$S{authcookie}')
        .patch('/projects/{id}')
        .withPathParams('id', `$S{projectid}`)
        .withBody({
          users: [`$S{userid}`],
        })
        .expectJson('id', '$S{projectid}')
        .expectJson('name', 'Updated Project')
        .expectJson('description', 'Updated description')
        .expectStatus(200);
    });

    it('should delete a project', () => {
      return pactum
        .spec()
        .withCookies('$S{authcookie}')
        .delete('/projects/{id}')
        .withPathParams('id', `$S{projectid}`)
        .expectStatus(204);
    });

    // Additional test cases for projects

    it('should associate a task with a project and retrieve it', async () => {
      // Create a project
      const createProjectResponse = await pactum
        .spec()
        .post('/projects')
        .withCookies('$S{authcookie}')
        .withBody({
          name: 'Test Project',
          description: 'Test description',
          categories: ['$S{categoryid}'],
          tags: ['$S{tagid}'],
        })
        .stores('projectId', 'id')
        .expectStatus(201);

      // Get the created project ID
      const projectId = createProjectResponse.body.id;

      // Create a task associated with the project
      const createTaskResponse = await pactum
        .spec()
        .post('/tasks')
        .withCookies('$S{authcookie}')
        .withBody({ name: 'Test Task', projectId }) // Associate the task with the created project
        .stores('taskid', 'id')
        .expectStatus(201);

      // Retrieve the created task and verify the association with the project
      const taskId = createTaskResponse.body.id;
      await pactum
        .spec()
        .get(`/tasks/${taskId}`)
        .withCookies('$S{authcookie}')
        .expectJson('name', 'Test Task')
        .expectJson('projectId', projectId)
        .expectStatus(200);
      // Retrieve the created project and verify the associated task
      await pactum
        .spec()
        .get(`/projects/${projectId}`)
        .withCookies('$S{authcookie}')
        .expectJson('name', 'Test Project')
        .expectJson('tasks.0.name', 'Test Task') // Assert on the first task in the tasks array
        .expectJson('tasks.0.projectId', projectId)
        .expectStatus(200);
    });

    it('should return a list of projects with pagination', async () => {
      await pactum
        .spec()
        .get('/projects')
        .withCookies('$S{authcookie}')
        .withQueryParams({
          page: 1,
          limit: 10,
        })
        .expectStatus(200)
        .expectJson('data.0.name', 'Test Project')
        .expectJson('meta', {
          page: 1,
          limit: 10,
          totalItems: 1,
        });
    });

    it('should return a list of projects with pagination and filter', async () => {
      await pactum
        .spec()
        .get('/projects')
        .withCookies('$S{authcookie}')
        .withQueryParams({
          page: 1,
          limit: 10,
          // name: 'Test Project',
          category: `$S{categoryid}`,
          tag: '$S{tagid}',
          q: 'description',
        })
        .expectStatus(200)
        .expectJson('data.0.name', 'Test Project')
        .expectJson('meta', {
          page: 1,
          limit: 10,
          totalItems: 1,
        });
    });
    it('should return a empty list of projects with filter for data not in description or name', async () => {
      await pactum
        .spec()
        .get('/projects')
        .withCookies('$S{authcookie}')
        .withQueryParams({
          q: 'jkhgkjhgkjhkjhbkjhbjhb',
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

    describe('Assigning task to user and its associations', () => {
      it('should return empty list of tasks for this project ', async () => {
        await pactum
          .spec()
          .get(`/projects/$S{projectId}/mytasks`)
          .withCookies('$S{authcookie}')
          .expectJsonMatch([])
          .expectStatus(200);
      });
      it('should fail when assigning this project to current user', async () => {
        await pactum
          .spec()
          .post(`/projects/9809809/assign`)
          .withCookies('$S{authcookie}')
          .expectStatus(400);
      });

      it('should assign a task of this project to this user', async () => {
        // Create a task associated with the project
        await pactum
          .spec()
          .post('/tasks')
          .withCookies('$S{authcookie}')
          .withBody({ name: 'Test Task 1', projectId: '$S{projectId}' }) // Associate the task with the created project
          .stores('taskid1', 'id')
          .expectStatus(201);
        // create another task and attach to project
        await pactum
          .spec()
          .post('/tasks')
          .withCookies('$S{authcookie}')
          .withBody({ name: 'Test Task 2', projectId: '$S{projectId}' }) // Associate the task with the created project
          .stores('taskid2', 'id')
          .expectStatus(201);

        await pactum
          .spec()
          .get('/tasks')
          .withCookies('$S{authcookie}')
          .expectStatus(200);

        // this will list the details of the project. it will have the tasks also
        await pactum
          .spec()
          .get(`/projects/$S{projectId}`)
          .withCookies('$S{authcookie}')
          .expectStatus(200);

        // assign these tasks to the user
        // await pactum
        //   .spec()
        //   .post(`/projects/$S{projectId}/mytasks`)
        //   .withCookies('$S{authcookie}')
        //   .withBody({
        //     taskId: '$S{taskid1}',
        //     userId: '$S{userid}',
        //   })
        //   .expectStatus(201);

        // await pactum
        //   .spec()
        //   .post(`/projects/$S{projectId}/mytasks`)
        //   .withCookies('$S{authcookie}')
        //   .withBody({
        //     taskId: '$S{taskid2}',
        //     userId: '$S{userid}',
        //   })
        //   .expectStatus(201);
      });
      it('should assign this project to current user', async () => {
        await pactum
          .spec()
          .post(`/projects/$S{projectId}/assign`)
          .withCookies('$S{authcookie}')
          .expectStatus(200);
      });
      it('should fail when assigning a wrong taskid ', async () => {
        await pactum
          .spec()
          .post(`/projects/$S{projectId}/mytasks`)
          .withCookies('$S{authcookie}')
          .withBody({
            taskId: 2323,
            userId: 23,
          })
          .expectStatus(404);
      });

      it('should return list of tasks of this project of user ', async () => {
        await pactum
          .spec()
          .get(`/projects/$S{projectId}/mytasks`)
          .withCookies('$S{authcookie}')
          .expectJsonLength(3)
          .stores('usertaskid1', '0.id')
          .expectStatus(200);
      });
      it('should update user task with new status ', async () => {
        await pactum
          .spec()
          .patch(`/projects/$S{projectId}/mytasks/$S{taskid1}/status`)
          .withCookies('$S{authcookie}')
          .withBody({
            userTaskId: '$S{usertaskid1}',
            status: 'IN_PROGRESS',
          })
          .expectStatus(200);
      });
      it('should fail when updating user task with wrong status ', async () => {
        await pactum
          .spec()
          .patch(`/projects/$S{projectId}/mytasks/$S{taskid1}/status`)
          .withCookies('$S{authcookie}')
          .withBody({
            userTaskId: '$S{usertaskid1}',
            status: 'WRONG',
          })
          .expectJson(
            'message.0',
            'status must be one of the following values: TODO, IN_PROGRESS, COMPLETED',
          )
          .expectStatus(400);
      });
      it('should return list of tasks of this project of user ', async () => {
        await pactum
          .spec()
          .get(`/projects/$S{projectId}/mytasks`)
          .withCookies('$S{authcookie}')
          .expectJsonLength(3)
          .expectBodyContains('$S{usertaskid1}')
          .expectBodyContains('IN_PROGRESS')
          .expectStatus(200);
      });
    });
    // ... more test cases ...
  });
  // end projects
});
