import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from 'src/profile/profile.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private profileService: ProfileService,
  ) {}

  async createToken(user: UserDto) {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }

  public async createUser(registerDto: RegisterDto): Promise<UserDto> {
    const profile: Profile = await this.profileService.create(registerDto.userInfo);
    const user = await this.userService.create(registerDto.credentials, profile);

    return user;
  }
}
