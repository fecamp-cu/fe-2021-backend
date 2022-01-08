import { IsNotEmpty, IsPhoneNumber, IsPostalCode } from 'class-validator';

export class ProfileDto {
  id: number;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  imageUrl: string;

  @IsNotEmpty()
  @IsPhoneNumber('TH')
  tel: string;

  @IsNotEmpty()
  grade: string;

  @IsNotEmpty()
  school: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  subdistrict: string;

  @IsNotEmpty()
  district: string;

  @IsNotEmpty()
  province: string;

  @IsNotEmpty()
  @IsPostalCode()
  postcode: string;

  constructor(partial: Partial<ProfileDto>) {
    Object.assign(this, partial);
  }
}
