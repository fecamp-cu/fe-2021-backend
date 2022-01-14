import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { google } from 'googleapis';
import { GoogleAuthData } from 'src/common/types/auth';
import { GoogleUserInfo } from 'src/common/types/google/google-api';

@Injectable()
export class GoogleAuthentication {
  private client;
  private instance: AxiosInstance;
  constructor(private configService: ConfigService) {
    this.client = new google.auth.OAuth2({
      clientId: this.configService.get<string>('google.oauth.clientID'),
      clientSecret: this.configService.get<string>('google.oauth.clientSecret'),
      redirectUri: this.configService.get<string>('google.oauth.callbackURI'),
    });

    this.instance = axios.create({
      baseURL: 'https://oauth2.googleapis.com',
      timeout: 5000,
    });
  }

  public getUrl(scopes: string[]): string {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });
  }

  public async getTokens(code: string): Promise<GoogleAuthData> {
    const { tokens } = await this.client.getToken(code);
    return tokens;
  }

  public async getUserInfo(): Promise<GoogleUserInfo> {
    const res = await google.oauth2({ version: 'v2', auth: this.client }).userinfo.get();
    return res.data as GoogleUserInfo;
  }

  public async setCredentials(tokens: GoogleAuthData) {
    this.client.setCredentials(tokens);
  }

  async redeemRefreshToken(refreshToken: string): Promise<GoogleAuthData> {
    const params = new URLSearchParams();
    params.append('client_id', this.configService.get<string>('google.oauth.clientID'));
    params.append('client_secret', this.configService.get<string>('google.oauth.clientSecret'));
    params.append('refresh_token', refreshToken);
    params.append('grant_type', 'refresh_token');

    try {
      const res = await this.instance.post('/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return res.data as GoogleAuthData;
    } catch (err) {
      throw new HttpException(err.response.statusText, err.response.status);
    }
  }
}
