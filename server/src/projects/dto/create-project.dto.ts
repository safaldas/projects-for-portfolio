import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'The name of the project',
    example: 'My Awesome Project',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the project',
    example: 'This project will do something really cool!',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'An array of user IDs to associate with the project',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  users: number[];

  @ApiProperty({
    description: 'An array of category IDs to associate with the project',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  categories: number[];

  @ApiPropertyOptional({
    description: 'An array of tag IDs to associate with the project',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tags: number[];
}
