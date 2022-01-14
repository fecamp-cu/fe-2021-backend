import { HttpException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as faker from 'faker';
import { FacebookAuthData } from '../../common/types/auth';
import { FacebookUserInfo } from '../../common/types/facebook/facebook';

@Injectable()
export class FacebookAuthentication {
  private state: string;
  private token: string;
  private instance: AxiosInstance;
  constructor(private configService: ConfigService) {
    this.instance = axios.create({
      baseURL: 'https://graph.facebook.com',
      timeout: 5000,
    });
  }

  public getUrl(scopes: string[]): string {
    this.state = faker.datatype.string(30);
    return encodeURI(
      `https://www.facebook.com/v12.0/dialog/oauth?client_id=${this.configService.get<string>(
        'facebook.appID',
      )}&redirect_uri=${this.configService.get<string>(
        'facebook.callbackURI',
      )}&state=${encodeURIComponent(this.state)}&response_type=code&scope=${scopes.join(' ')}`,
    );
  }

  public async setCredentials(token: FacebookAuthData) {
    this.token = token.access_token;
  }

  public async getUserInfo(): Promise<FacebookUserInfo> {
    try {
      const res = await this.instance.get('/me', {
        params: { fields: 'id,name,email,picture', access_token: this.token },
      });

      return res.data as FacebookUserInfo;
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }

  public async redeemCode(state: string, code: string): Promise<FacebookAuthData> {
    this.validateState(state);
    try {
      const res = await this.instance.get('/v12.0/oauth/access_token', {
        params: {
          client_id: this.configService.get<string>('facebook.appID'),
          client_secret: this.configService.get<string>('facebook.appSecret'),
          redirect_uri: this.configService.get<string>('facebook.callbackURI'),
          code,
        },
      });

      return res.data as FacebookAuthData;
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }

  private validateState(state: string) {
    state = decodeURIComponent(state);
    if (state !== this.state) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_STATE',
        message: "State isn't match with the one sent by Facebook",
      });
    }
  }
}
