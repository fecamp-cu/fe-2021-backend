export class UserDto {
  id: number;
  username: string;
  password: string;
  email: string;
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
