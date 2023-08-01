import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GetByIdDto {
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
