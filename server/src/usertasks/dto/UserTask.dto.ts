import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class UserTaskDto {
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
}
