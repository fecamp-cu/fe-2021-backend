import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';
import { Basket, OmiseSource } from 'src/common/types/payment';

export class PaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  source: OmiseSource;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsPhoneNumber('TH')
  tel: string;

  @ApiProperty()
  @IsString()
  grade: string;

  @ApiProperty()
  @IsString()
  school: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  subdistrict: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsPostalCode('TH')
  postcode: string;

  @ApiProperty()
  @IsNotEmpty()
  basket: Basket[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  promotion_code?: string;

  constructor(partial: Partial<PaymentDto>) {
    Object.assign(this, partial);
  }
}
