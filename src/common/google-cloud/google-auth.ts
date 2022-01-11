import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { GoogleAuthData } from '../types/auth';
import { GoogleUserInfo } from '../types/google/google-api';

export class GoogleAuthentication {
  private client;
  constructor(private configService: ConfigService) {
    this.client = new google.auth.OAuth2({
      clientId: this.configService.get<string>('google.oauth.clientID'),
      clientSecret: this.configService.get<string>('google.oauth.clientSecret'),
      redirectUri: this.configService.get<string>('google.oauth.callbackURI'),
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

  public setCredentials(tokens: GoogleAuthData): void {
    this.client.setCredentials(tokens);
  }

  public async getUserInfo(): Promise<GoogleUserInfo> {
    const res = await google.oauth2({ version: 'v2', auth: this.client }).userinfo.get();
    return res.data as GoogleUserInfo;
  }
}
