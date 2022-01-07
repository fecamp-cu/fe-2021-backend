import { ProfileDto } from 'src/profile/dto/profile.dto';

export class UserDto {
  id: number;

  username: string;

  password: string;

  email: string;

  profile?: ProfileDto;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
