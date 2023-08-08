import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: "User's email address",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: "User's name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 123,
    description: "User's unique identifier",
  })
  id: number;

  @ApiProperty({
    example: '2023-08-06T12:34:56.789Z',
    description: 'Timestamp when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-08-06T12:34:56.789Z',
    description: 'Timestamp when the user was last updated',
  })
  updatedAt: Date;
}
