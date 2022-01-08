import { IsNotEmpty } from 'class-validator';
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { UserDto } from 'src/user/dto/user.dto';

export class RegisterDto {
  @IsNotEmpty()
  credentials: UserDto;

  @IsNotEmpty()
  userInfo: ProfileDto;
}
