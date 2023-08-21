import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({
    example: 1,
    description:
      'the userTaskId of the task. This is not the task id but the relation between user and task. this is recieved in the get /projects/$S{projectId}/tasks api',
  })
  @IsNotEmpty()
  userTaskId: number;
}
