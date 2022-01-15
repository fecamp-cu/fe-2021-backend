import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(8, { message: 'Password must at least 8 character' })
  password?: string;
}
