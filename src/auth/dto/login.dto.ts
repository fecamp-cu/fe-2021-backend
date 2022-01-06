import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must at least 8 character' })
  password: string;
}
