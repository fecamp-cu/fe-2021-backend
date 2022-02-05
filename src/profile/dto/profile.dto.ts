import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsPostalCode, IsString, IsUrl } from 'class-validator';
import { Grade } from 'src/common/enums/profile';

export class ProfileDto {
  id: number;

  @ApiProperty({ example: 'Fe Camp' })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ example: 'https://imgurl.com' })
  @IsUrl()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({ example: '0812345678' })
  @IsPhoneNumber('TH')
  @IsOptional()
  tel: string;

  @ApiProperty({ enum: Grade, example: Grade.M4 })
  @IsString()
  @IsOptional()
  grade: Grade;

  @ApiProperty({ example: 'Chulalongkorn University' })
  @IsString()
  @IsOptional()
  school: string;

  @ApiProperty({ example: '254 Phayathai Rd.' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ example: 'Wanmai' })
  @IsString()
  @IsOptional()
  subdistrict: string;

  @ApiProperty({ example: 'Pathumwan' })
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty({ example: 'Bangkok' })
  @IsString()
  @IsOptional()
  province: string;

  @ApiProperty({ example: '10330' })
  @IsPostalCode('TH')
  @IsOptional()
  postcode: string;

  constructor(partial: Partial<ProfileDto>) {
    Object.assign(this, partial);
  }
}
