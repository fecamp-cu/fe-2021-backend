import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the user',
  })
  @IsOptional()
  id?: number;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'email of the user',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'password',
    description: 'New password of the user',
  })
  @MinLength(8, { message: 'Password must at least 8 character' })
  @IsOptional()
  password?: string;
}
