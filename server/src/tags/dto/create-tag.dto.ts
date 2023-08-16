import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'The name of the Tag',
    example: 'General',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
