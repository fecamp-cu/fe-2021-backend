import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class ContactDto {
  id: number;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  tel: string;
}
