import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';
import { Bank } from 'src/common/enums/shop';
import { Basket, OmiseSource } from 'src/common/types/payment';

export class PaymentDto {
  @ApiProperty()
  @IsOptional()
  source: OmiseSource;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Bank)
  bank: Bank;

  @ApiProperty({ example: 'admin@fecamp.in.th' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'FE Camp' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '0812345678' })
  @IsPhoneNumber('TH')
  tel: string;

  @ApiProperty({ example: 'M4' })
  @IsString()
  grade: string;

  @ApiProperty({ example: 'Chulalongkorn University' })
  @IsString()
  school: string;

  @ApiProperty({ example: '254 Phayathai Rd.' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Wanmai' })
  @IsString()
  subdistrict: string;

  @ApiProperty({ example: 'Pathumwan' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Bangkok' })
  @IsString()
  province: string;

  @ApiProperty({ example: '10330' })
  @IsPostalCode('TH')
  postcode: string;

  @ApiProperty({
    example: [
      { price: 100, productId: 1, quantity: 1 },
      { price: 200, productId: 2, quantity: 1 },
    ],
  })
  @IsNotEmpty()
  basket: Basket[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  promotionCode?: string;

  constructor(partial: Partial<PaymentDto>) {
    Object.assign(this, partial);
  }
}
