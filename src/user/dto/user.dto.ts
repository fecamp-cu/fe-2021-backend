import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { TokenDto } from 'src/auth/dto/token.dto';
import { Role } from 'src/common/enums/role';
import { ProfileDto } from 'src/profile/dto/profile.dto';

export class UserDto {
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must at least 8 character' })
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  profile?: ProfileDto;

  tokens?: TokenDto[];

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
