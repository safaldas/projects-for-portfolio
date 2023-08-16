import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty({
    description: 'The auto-generated id of the task',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The date/time when the task was created',
    example: '2023-01-01T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date/time the task was last updated',
    example: '2023-01-02T14:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The name of the task',
    example: 'Build new feature',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the task',
    example: 'Implement the new feature and write tests',
  })
  description: string;

  @ApiProperty({
    description: 'The status of the task',
    example: 'IN_PROGRESS',
  })
  status: string;

  @ApiProperty({
    description: 'The id of the project this task belongs to',
    example: 1,
  })
  projectId: number;
}
