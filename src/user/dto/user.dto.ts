import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsString, MinLength } from 'class-validator';
import { TokenDto } from 'src/auth/dto/token.dto';
import { ValidateCodeDto } from 'src/auth/dto/validate-code.dto';
import { Role } from 'src/common/enums/role';
import { ProfileDto } from 'src/profile/dto/profile.dto';

export class UserDto {
  id: number;

  @ApiProperty({ example: 'Fe Camp', description: 'Just a displayname' })
  @IsString()
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

  @ApiProperty()
  @IsEmpty()
  isEmailVerified: boolean;

  @ApiProperty()
  @IsEmpty()
  role: Role;

  @ApiProperty()
  profile?: ProfileDto;

  tokens?: TokenDto[];

  verifiedCodes: ValidateCodeDto[];

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
