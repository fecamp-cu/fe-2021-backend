import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto-js';
import { FacebookAuthData, GoogleAuthData, ServiceType } from 'src/common/types/auth';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { TokenDto } from './dto/token.dto';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private profileService: ProfileService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  async createToken(user: UserDto) {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async createRefreshToken(uid: number): Promise<string> {
    const serviceType = 'fecamp';
    const refreshToken = await uuidv4();
    const user = await this.userService.findOne(uid, ['tokens']);
    const tokenDto = new TokenDto({
      refreshToken,
      expiresDate: new Date(
        Date.now() + parseInt(this.configService.get<string>('jwt.tokenDuration')) * 1000,
      ),
      serviceType,
      user,
    });

    await this.storeToken(tokenDto, user, serviceType);

    return refreshToken;
  }

  async createTokenEntity(tokenDto: TokenDto): Promise<TokenDto> {
    const token: Token = await this.tokenRepository.create(tokenDto);
    const createdToken: Token = await this.tokenRepository.save(token);
    return new TokenDto({
      id: createdToken.id,
      serviceType: createdToken.serviceType,
      accessToken: createdToken.accessToken,
      refreshToken: createdToken.refreshToken,
      expiresDate: createdToken.expiresDate,
    });
  }

  async findRefreshToken(refreshToken: string): Promise<TokenDto> {
    const token = await this.tokenRepository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    return new TokenDto({
      id: token.id,
      serviceType: token.serviceType,
      refreshToken: token.refreshToken,
      expiresDate: token.expiresDate,
      user: token.user,
    });
  }

  async clearRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.delete({ refreshToken });
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
      await this.createTokenEntity(tokenDto);
      return new UserDto({
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile,
      });
    }

    await this.tokenRepository.update(token.id, tokenDto);
    return new UserDto({
      id: user.id,
      email: user.email,
      username: user.username,
      profile: user.profile,
    });
  }
}
