import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsPostalCode } from 'class-validator';

export class ProfileDto {
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('TH')
  tel: string;

  @ApiProperty()
  @IsNotEmpty()
  grade: string;

  @IsNotEmpty()
  school: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  subdistrict: string;

  @ApiProperty()
  @IsNotEmpty()
  district: string;

  @ApiProperty()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPostalCode()
  postcode: string;

  constructor(partial: Partial<ProfileDto>) {
    Object.assign(this, partial);
  }
}
