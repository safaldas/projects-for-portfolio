import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignUserToTaskDto {
  @ApiProperty({
    example: 1,
    description: 'the taskid to update ',
  })
  @IsNotEmpty()
  @IsNumber()
  taskId: number;
}
