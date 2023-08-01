import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  tasks?: string[]; // An array of task strings (strings)

  @IsArray()
  users: number[]; // An array of user IDs (numbers)

  @IsArray()
  categories: number[]; // An array of category IDs (numbers)

  @IsArray()
  tags: number[]; // An array of tag IDs (numbers)
}
