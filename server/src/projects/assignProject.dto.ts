import { ApiProperty } from '@nestjs/swagger';

export class AssignProjectDto {
  @ApiProperty({
    description: 'Project assigned successfully',
    example: 'Project assigned successfully',
  })
  description: string;
}
