import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TaskFilterDto {
  @ApiProperty({
    required: false,
    description: 'Filter by name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'General search term for name and description',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by PROJECT ID',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  projectId?: number;

  @ApiProperty({
    required: false,
    description: 'order by ascending',
    example: 'name',
  })
  @IsOptional()
  @IsString()
  orderByAsc?: string;

  @ApiProperty({
    required: false,
    description: 'order by descending',
    example: 'name',
  })
  @IsOptional()
  @IsString()
  orderByDesc?: string;
}
