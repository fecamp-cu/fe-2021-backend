import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsPostalCode, IsString, IsUrl } from 'class-validator';
import { Grade } from 'src/common/enums/profile';

export class ProfileDto {
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  imageUrl: string;

  @ApiProperty()
  @IsPhoneNumber('TH')
  @IsOptional()
  tel: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  grade: Grade;

  @ApiProperty()
  @IsString()
  @IsOptional()
  school: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subdistrict: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  province: string;

  @ApiProperty()
  @IsPostalCode('TH')
  @IsOptional()
  postcode: string;

  constructor(partial: Partial<ProfileDto>) {
    Object.assign(this, partial);
  }
}
