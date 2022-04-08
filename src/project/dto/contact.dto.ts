import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

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

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isLeader: boolean;

  constructor(partial: Partial<ContactDto>) {
    Object.assign(this, partial);
  }
}
