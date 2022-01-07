import { Role } from 'src/common/enums/role';

export class UserDto {
  id: number;
  username: string;
  password: string;
  email: string;
  role: Role;
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
