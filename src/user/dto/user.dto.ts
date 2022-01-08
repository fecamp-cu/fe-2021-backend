import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { TokenDto } from 'src/token/dto/token.dto';

export class UserDto {
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must at least 8 character' })
  password: string;

  @IsEmail()
  email: string;

  profile?: ProfileDto;

  tokens?: TokenDto[];

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
