import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignUserToTaskDto } from './dto/assignUserToTask.dto';
import { UpdateTaskStatusDto } from './dto/updateTaskStatus.dto';

@Injectable()
export class UsertasksService {
  constructor(private readonly prisma: PrismaService) {}

  // Update the status of an user task
  async updateUserTaskStatus({ status, userTaskId }: UpdateTaskStatusDto) {
    return this.prisma.userTask.update({
      where: {
        id: userTaskId,
      },
      data: { status },
    });
  }

  // Assign a task to a user
  async assignTaskToUser({ taskId }: AssignUserToTaskDto, userId) {
    return this.prisma.userTask.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        task: {
          connect: {
            id: taskId,
          },
        },
        status: 'TODO',
      },
    });
  }
}
