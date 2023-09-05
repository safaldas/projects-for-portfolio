import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Updated Project',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'Updated description',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  // @ApiProperty({
  //   description: 'An array of task IDs',
  //   example: [1, 2, 3],
  //   type: [Number],
  // })
  // @IsArray()
  // @IsOptional()
  // tasks?: number[];

  // @ApiProperty({
  //   description: 'An array of user IDs',
  //   example: [1, 2, 3],
  //   type: [Number],
  // })
  // @IsOptional()
  // @IsArray()
  // users: number[];

  @ApiProperty({
    description: 'An array of category IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  categories: number[];

  @ApiProperty({
    description: 'An array of tag IDs',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  tags: number[];
}
