import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  id: number;
}
