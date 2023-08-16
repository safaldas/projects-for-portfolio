import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  id: number;
}
