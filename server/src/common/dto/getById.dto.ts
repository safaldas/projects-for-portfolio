import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNumberString } from 'class-validator';

export class GetByIdDto {
  @ApiProperty({
    description: 'The id of the item',
    example: 1,
  })
  @IsDefined()
  @IsNumberString()
  @Type(() => Number)
  id: number;
}
