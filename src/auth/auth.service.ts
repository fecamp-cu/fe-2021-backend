import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto-js';
import { FacebookAuthData, GoogleAuthData, ServiceType } from 'src/common/types/token';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';
import { TokenDto } from 'src/token/dto/token.dto';
import { TokenService } from 'src/token/token.service';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private profileService: ProfileService,
    private tokenService: TokenService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createToken(user: UserDto) {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }

  public async createUser(registerDto: RegisterDto): Promise<UserDto> {
    const count = await this.userService.count({ username: registerDto.credentials.username });
    if (count > 0) {
      registerDto.credentials.username = registerDto.credentials.username + '#' + (count + 1);
    }
    const profile: Profile = await this.profileService.create(registerDto.userInfo);
    const user = await this.userService.create(registerDto.credentials, profile);

    return user;
  }

  public async storeGoogleToken(tokens: GoogleAuthData, user: UserDto): Promise<UserDto> {
    const serviceType: ServiceType = 'google';
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

    return await this.storeToken(tokenDto, user, serviceType);
  }

  public async storeFacebookToken(tokens: FacebookAuthData, user: UserDto): Promise<UserDto> {
    const serviceType: ServiceType = 'facebook';
    const tokenDto = new TokenDto({
      accessToken: await crypto.AES.encrypt(
        tokens.access_token,
        this.configService.get<string>('encryptionKey'),
      ).toString(),

      expiresDate: new Date(tokens.expires_in * 1000 + Date.now()),
      serviceType,
      user,
    });

    return await this.storeToken(tokenDto, user, serviceType);
  }

  private async storeToken(tokenDto: TokenDto, user: UserDto, serviceType: ServiceType) {
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

    const savedUser = await this.userRepository.save(user);
    return new UserDto({
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      profile: savedUser.profile,
    });
  }
}
