import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsPhoneNumber,
  IsPostalCode,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/role';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @MinLength(8, { message: 'Password must at least 8 character' })
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsEmpty()
  role: Role;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  @IsPhoneNumber('TH')
  tel: string;

  @ApiProperty()
  @IsNotEmpty()
  grade: string;

  @ApiProperty()
  @IsNotEmpty()
  school: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  subdistrict: string;

  @ApiProperty()
  @IsNotEmpty()
  district: string;

  @ApiProperty()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @IsPostalCode('TH')
  postcode: string;

  constructor(partial: Partial<RegisterDto>) {
    Object.assign(this, partial);
  }
}
