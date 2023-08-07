import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
