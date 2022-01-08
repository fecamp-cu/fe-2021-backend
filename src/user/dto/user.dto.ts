import { Role } from 'src/common/enums/role';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { ProfileDto } from 'src/profile/dto/profile.dto';


export class UserDto {
  id: number;

  @IsNotEmpty()
  username: string;

  password: string;

  @IsEmail()
  email: string;

  role: Role;

  profile?: ProfileDto;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
