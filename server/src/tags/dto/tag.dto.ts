import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  id: number;

  @ApiProperty({
    example: '2023-08-06T12:34:56.789Z',
    description: 'Timestamp when created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-08-06T12:34:56.789Z',
    description: 'Timestamp when last updated',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 2,
    description: 'Id of user who created this',
  })
  createdBy: Date;
}
