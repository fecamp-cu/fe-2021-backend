import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from 'src/common/enums/role';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must at least 8 character' })
  password: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: Role;
}
