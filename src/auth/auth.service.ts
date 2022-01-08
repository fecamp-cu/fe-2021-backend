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

  public async storeToken(
    tokens: OAuthResponse,
    serviceType: ServiceType,
    user: UserDto,
  ): Promise<UserDto> {
    const tokenDto = new TokenDto({
      accessToken: await crypto.AES.encrypt(
        tokens.access_token,
        this.configService.get<string>('encryptionKey'),
      ).toString(),

      refreshToken: await crypto.AES.encrypt(
        tokens.refresh_token,
        this.configService.get<string>('encryptionKey'),
      ).toString(),

      expiresDate: new Date(tokens.expiry_date),
      serviceType,
      user,
    });

    let token: TokenDto;
    if (user.tokens) {
      token = user.tokens.find(token => token.serviceType === serviceType);
    }

    if (!token) {
      token = await this.tokenService.create(tokenDto);
      if (!user.tokens) {
        user.tokens = [];
      }
      user.tokens = user.tokens.concat(token);

      return await this.userRepository.save(user);
    }

    token = await this.tokenService.update(token.id, tokenDto);
    user.tokens.filter(token => token.serviceType !== serviceType).concat(token);

    return await this.userRepository.save(user);
  }
}
