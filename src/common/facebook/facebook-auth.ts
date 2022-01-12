import { UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as faker from 'faker';
import { FacebookAuthData } from '../types/auth';
import { FacebookUserInfo } from '../types/facebook/facebook';

export class FacebookAuthentication {
  private state: string;
  private token: string;
  constructor(private configService: ConfigService) {}

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

  public async redeemCode(state: string, code: string): Promise<FacebookAuthData> {
    this.validateState(state);
    const url = `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${this.configService.get<string>(
      'facebook.appID',
    )}&redirect_uri=${this.configService.get<string>(
      'facebook.callbackURI',
    )}&client_secret=${this.configService.get<string>('facebook.appSecret')}&code=${code}`;

    const res = await axios.get(url);

    return res.data as FacebookAuthData;
  }

  public async setCredentials(token: FacebookAuthData) {
    this.token = token.access_token;
  }

  public async getUserInfo(): Promise<FacebookUserInfo> {
    const url = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${this.token}`;
    const res = await axios.get(url);
    return res.data as FacebookUserInfo;
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
