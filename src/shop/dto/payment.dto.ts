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
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
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
