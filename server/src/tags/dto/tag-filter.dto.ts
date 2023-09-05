import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TagFilterDto {
  @ApiProperty({
    required: false,
    description: 'Filter by name',
    example: 'General',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'General search term for name',
    example: 'e',
  })
  @IsOptional()
  @IsString()
  q?: string;

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
