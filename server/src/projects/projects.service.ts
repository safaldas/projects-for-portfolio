import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FilterDto, PaginationDto } from 'src/common/dto';
import { PaginationService } from '../common/services/pagination.service';
import { Project, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    try {
      const projectData: any = {
        name: createProjectDto.name,
        description: createProjectDto.description,
        createdBy: user.id,
      };

      if (createProjectDto.users) {
        projectData.users = {
          connect: createProjectDto.users.map((userId) => ({ id: userId })),
        };
      }

      if (createProjectDto.categories) {
        projectData.categories = {
          connect: createProjectDto.categories.map((categoryId) => ({
            id: categoryId,
          })),
        };
      }

      if (createProjectDto.tags) {
        projectData.tags = {
          connect: createProjectDto.tags.map((tagId) => ({ id: tagId })),
        };
      }

      const project = await this.prisma.project.create({
        data: projectData,
        include: {
          tasks: true,
          users: true,
          categories: true,
          tags: true,
        },
      });

      return project;
    } catch (error) {
      // console.error('Error creating project:', error);
      throw new BadRequestException('Invalid value'); // Rethrow the error for proper error handling
    }
  }

  findAll(paginationDto: PaginationDto, filterDto: FilterDto) {
    const include = {
      tasks: true,
      users: true,
      categories: true,
      tags: true,
    };
    return this.paginationService.findAll(
      'project',
      paginationDto,
      filterDto,
      include,
    );
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: true,
        users: true,
        categories: true,
        tags: true,
      },
    });
    if (project) {
      return project;
    } else {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    // Map tasks property to Prisma's format
    function generateConnectionIds(modelName) {
      const updates = {
        set:
          updateProjectDto[modelName]?.map((itemId) => ({ id: itemId })) || [],
      };
      return updates;
    }

    const updateData = {
      name: updateProjectDto.name,
      description: updateProjectDto.description,
      tasks: generateConnectionIds('tasks'),
      users: generateConnectionIds('users'),
      tags: generateConnectionIds('tags'),
      categories: generateConnectionIds('categories'),
    };
    const item = await this.prisma.project.update({
      where: { id },
      data: updateData,
    });
    if (item) return item;
  }

  async remove(id: number) {
    try {
      const item = await this.prisma.project.delete({
        where: { id },
      });
      return item;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // Handle foreign key constraint error
          throw new NotFoundException(
            'Project not found or associated with tasks.',
          );
        }
      }

      // Handle other errors or re-throw if needed
      throw error;
    }
  }

  async findTasksByUserAndByProjectId(userId: number, projectId: number) {
    return this.prisma.userTask.findMany({
      where: {
        userId,
        task: {
          projectId,
        },
      },
      include: {
        task: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });
  }

  async assignProjectToUser(projectId: number, userid: number) {
    // add the userid to project users list
    try {
      const project = await this.prisma.project.update({
        where: { id: projectId },
        data: { users: { connect: { id: userid } } },
        select: {
          tasks: {
            select: {
              id: true,
            },
          },
        },
      });

      if (project.tasks.length) {
        // assign all tasks to this user
        const userTasksToCreate = project.tasks.map(({ id }) => {
          return {
            userId: userid,
            taskId: id,
          };
        });
        const userTasks = await this.prisma.userTask.createMany({
          data: userTasksToCreate,
        });

        return {
          userTasks,
          description: 'Project assigned successfully',
        };
      }
    } catch (error) {
      // console.error('Error assigning project to user:', error.message);
      throw new BadRequestException('Error assigning project to user');
    }
  }
}
