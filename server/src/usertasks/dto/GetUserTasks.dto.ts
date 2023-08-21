import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { TaskDto } from '../../tasks/dto';

export class GetUserTaskDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    example: '2023-08-06T12:34:56.789Z',
    description: 'Timestamp when created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-08-06T12:34:56.789Z',
    description: 'Timestamp when last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    example: TaskStatus.IN_PROGRESS,
    description: 'The status of the task which is an enum',
    enum: TaskStatus,
  })
  status: TaskStatus;

  @ApiProperty({
    example: 2,
    description: 'Id of user who is assigned to this',
  })
  userId: number;

  @ApiProperty({
    example: 2,
    description: 'Id of task which is related this',
  })
  taskId: number;

  @ApiProperty({
    example: TaskDto,
    description: 'Id of task which is related this',
    type: TaskDto,
    required: false,
  })
  @IsOptional()
  task: TaskDto;
}
