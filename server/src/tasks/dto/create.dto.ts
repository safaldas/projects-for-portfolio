import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}
