import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ServiceType } from 'src/common/types/token';
import { UserDto } from 'src/user/dto/user.dto';

export class TokenDto {
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  serviceType: ServiceType;

  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty()
  @IsNotEmpty()
  expiresDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  user: UserDto;

  constructor(partial: Partial<TokenDto>) {
    Object.assign(this, partial);
  }
}
