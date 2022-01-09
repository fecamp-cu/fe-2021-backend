import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { UserDto } from 'src/user/dto/user.dto';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  credentials: UserDto;

  @ApiProperty()
  @IsNotEmpty()
  userInfo: ProfileDto;

  constructor(partial: Partial<RegisterDto>) {
    Object.assign(this, partial);
  }
}
