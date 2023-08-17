import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiProperty({
    example: 10,
  })
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
