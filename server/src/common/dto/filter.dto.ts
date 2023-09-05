import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterDto {
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
    description: 'Filter by category ID',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  category?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by tag ID',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tag?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by user ID',
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  user?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by order by ascending',
  })
  @IsOptional()
  @IsString()
  orderByAsc?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by order by descending',
  })
  @IsOptional()
  @IsString()
  orderByDesc?: string;
}
