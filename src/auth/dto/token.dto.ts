import { ServiceType } from 'src/common/enums/service-type';
import { UserDto } from 'src/user/dto/user.dto';

export class TokenDto {
  id: number;

  serviceType: ServiceType;

  serviceUserId: string;

  idToken: string;

  accessToken: string;

  refreshToken: string;

  expiresDate: Date;

  user: UserDto;

  constructor(partial: Partial<TokenDto>) {
    Object.assign(this, partial);
  }
}
