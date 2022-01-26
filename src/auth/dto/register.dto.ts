import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsPostalCode, MinLength } from 'class-validator';
import { Grade } from 'src/common/enums/profile';

export class RegisterDto {
  @ApiProperty({ example: 'Fe Camp', description: 'Just a displayname' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'Password must at least 8 character',
    minLength: 8,
  })
  @MinLength(8, { message: 'Password must at least 8 character' })
  password: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email must not duplicated from the existed in the database',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Fe Camp',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Admin',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'https://imgurl.com',
    description: 'URL of the avatar',
  })
  imageUrl: string;

  @ApiProperty({
    example: '0812345678',
    description: 'Phone number',
  })
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
