import { IsNotEmpty } from 'class-validator';
import { ServiceType } from 'src/common/types/token';
import { User } from 'src/user/entities/user.entity';

export class TokenDto {
  @IsNotEmpty()
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
  user: User;

  constructor(partial: Partial<TokenDto>) {
    Object.assign(this, partial);
  }
}
