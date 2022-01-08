import { IsNotEmpty } from 'class-validator';
import { ServiceType } from 'src/common/types/token';
import { UserDto } from 'src/user/dto/user.dto';

export class TokenDto {
  id: number;

  @IsNotEmpty()
  serviceType: ServiceType;

  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;

  @IsNotEmpty()
  expiresDate: Date;

  @IsNotEmpty()
  user: UserDto;

  constructor(partial: Partial<TokenDto>) {
    Object.assign(this, partial);
  }
}
