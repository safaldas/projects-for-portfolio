import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      // Create the project with tasks
      const project = await this.prisma.project.create({
        data: {
          name: createProjectDto.name,
          description: createProjectDto.description,
          tasks: {
            create: createProjectDto.tasks.map((taskName) => ({
              name: taskName,
            })),
          },
          users: {
            connect: createProjectDto.users.map((userId) => ({ id: userId })), // Connect the users to the project
          },
          categories: {
            connect: createProjectDto.categories.map((categoryId) => ({
              id: categoryId,
            })), // Connect the categories to the project
          },
          tags: {
            connect: createProjectDto.tags.map((tagId) => ({ id: tagId })), // Connect the tags to the project
          },
        },
        include: {
          tasks: true, // Optionally include the tasks in the result
          users: true, // Optionally include the users in the result
          categories: true, // Optionally include the categories in the result
          tags: true, // Optionally include the tags in the result
        },
      });

      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error; // Rethrow the error for proper error handling
    }
  }

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
