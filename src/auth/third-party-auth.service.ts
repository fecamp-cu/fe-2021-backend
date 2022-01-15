import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto-js';
import * as moment from 'moment';
import { FacebookAuthData, GoogleAuthData, ServiceType } from 'src/common/types/auth';
import { GoogleAuthentication } from 'src/third-party/google-cloud/google-auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class ThirdPartyAuthService {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userService: UserService,
    private googleAuth: GoogleAuthentication,
  ) {}

  async getAdminToken(serviceType: ServiceType): Promise<TokenDto> {
    const admin = await this.userService.findByEmail(
      this.configService.get<string>('admin.email'),
      ['tokens'],
    );

    const tokenIdx = admin.tokens.findIndex(token => token.serviceType === serviceType);

    admin.tokens[tokenIdx] = await this.authService.rawToDTO(admin.tokens[tokenIdx]);

    return new TokenDto({
      accessToken: admin.tokens[tokenIdx].accessToken,
      expiresDate: admin.tokens[tokenIdx].expiresDate,
      refreshToken: admin.tokens[tokenIdx].refreshToken,
      serviceType: admin.tokens[tokenIdx].serviceType,
      user: admin,
    });
  }

  public async storeGoogleToken(
    tokens: GoogleAuthData,
    user: UserDto,
    serviceUserId?: string,
  ): Promise<UserDto> {
    const serviceType: ServiceType = 'google';
    const tokenDto = new TokenDto({
      accessToken: await crypto.AES.encrypt(
        tokens.access_token,
        this.configService.get<string>('encryptionKey'),
      ).toString(),

      idToken: await crypto.AES.encrypt(
        tokens.id_token,
        this.configService.get<string>('encryptionKey'),
      ).toString(),

      expiresDate: new Date(tokens.expiry_date),
      serviceType,
      user,
    });

    if (tokens.refresh_token) {
      tokenDto.refreshToken = await crypto.AES.encrypt(
        tokens.refresh_token,
        this.configService.get<string>('encryptionKey'),
      ).toString();
    }

    if (serviceUserId) {
      tokenDto.serviceUserId = serviceUserId;
    }

    return await this.authService.storeToken(tokenDto, user, serviceType);
  }

  public async storeFacebookToken(
    tokens: FacebookAuthData,
    user: UserDto,
    serviceUserId?: string,
  ): Promise<UserDto> {
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

    if (serviceUserId) {
      tokenDto.serviceUserId = serviceUserId;
    }

    return await this.authService.storeToken(tokenDto, user, serviceType);
  }

  public async validateAndRefreshServiceToken(tokenDto: TokenDto): Promise<TokenDto> {
    const now = new Date().getTime();
    const expireTime = moment(tokenDto.expiresDate).toDate().getTime();

    if (expireTime < now) {
      const tokens: GoogleAuthData = await this.googleAuth.redeemRefreshToken(
        tokenDto.refreshToken,
      );

      tokens.expiry_date = moment(Date.now() + tokens.expires_in * 1000).toDate();

      await this.storeGoogleToken(tokens, tokenDto.user);

      return new TokenDto({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresDate: new Date(tokens.expiry_date),
        serviceType: tokenDto.serviceType,
      });
    }

    return tokenDto;
  }
}
