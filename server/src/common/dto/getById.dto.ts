import { Type } from 'class-transformer';
import { IsDefined, IsNumberString } from 'class-validator';

export class GetByIdDto {
  // @IsNotEmpty()
  @IsDefined()
  @IsNumberString()
  @Type(() => Number)
  id: number;
}
