import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  id?: number;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password' })
  @MinLength(8, { message: 'Password must at least 8 character' })
  @IsOptional()
  password?: string;
}
