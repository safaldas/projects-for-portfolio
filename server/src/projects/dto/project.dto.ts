import { ApiProperty } from '@nestjs/swagger';
import { Task, User, Category, Tag } from '@prisma/client';
import { CategoryDto } from '../../categories/dto';
import { UserDto } from '../../common/dto';
import { TagDto } from '../../tags/dto';
import { TaskDto } from '../../tasks/dto';

export class ProjectDto {
  @ApiProperty({
    description: 'The auto-generated ID of the project',
  })
  id: number;

  @ApiProperty({
    description: 'The date/time the project was created',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date/time the project was last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The name of the project',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the project',
  })
  description: string;

  @ApiProperty({
    description: 'The tasks associated with the project',
    type: [TaskDto],
  })
  tasks: Task[];

  @ApiProperty({
    description: 'The users associated with the project',
    type: [UserDto], // reference User model
  })
  users: User[];

  @ApiProperty({
    description: 'The categories associated with the project',
    type: [CategoryDto], // error here 'Category' only refers to a type, but is being used as a value here.ts(2693)
  })
  categories: Category[];

  @ApiProperty({
    description: 'The tags associated with the project',
    type: [TagDto], // reference Tag model
  })
  tags: Tag[];
}
