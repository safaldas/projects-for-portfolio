import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The name of the task',
    example: 'Create a page with details',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The  id of the project this task should belong to ',
    example: 11,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsOptional()
  @ApiProperty({
    description: 'The description of the task',
    example: 'this is a description',
  })
  description: string;

  @IsOptional()
  @ApiProperty({
    description: 'The description of the task',
    example: 'IN_PROGRESS',
    enum: TaskStatus,
  })
  status: TaskStatus;
}
