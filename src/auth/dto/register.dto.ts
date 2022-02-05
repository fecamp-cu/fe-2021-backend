import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsPostalCode, MinLength } from 'class-validator';
import { Grade } from 'src/common/enums/profile';

export class RegisterDto {
  @ApiProperty({ example: 'Fe Camp' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password', minLength: 8 })
  @MinLength(8, { message: 'Password must at least 8 character' })
  password: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Fe Camp' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Admin' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'https://imgurl.com' })
  imageUrl: string;

  @ApiProperty({ example: '0812345678' })
  @IsPhoneNumber('TH')
  tel: string;

  @ApiProperty({ enum: Grade, example: Grade.M4 })
  @IsNotEmpty()
  grade: Grade;

  @ApiProperty({ example: 'Chulalongkorn University' })
  @IsNotEmpty()
  school: string;

  @ApiProperty({ example: '254 Phayathai Rd.' })
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Wanmai' })
  @IsNotEmpty()
  subdistrict: string;

  @ApiProperty({ example: 'Pathumwan' })
  @IsNotEmpty()
  district: string;

  @ApiProperty({ example: 'Bangkok' })
  @IsNotEmpty()
  province: string;

  @ApiProperty({ example: '10330' })
  @IsPostalCode('TH')
  postcode: string;

  constructor(partial: Partial<RegisterDto>) {
    Object.assign(this, partial);
  }
}
