import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

export class GoogleAuthentication {
  private client;
  constructor(private configService: ConfigService) {
    this.client = new google.auth.OAuth2({
      clientId: this.configService.get<string>('google.oauth.clientID'),
      clientSecret: this.configService.get<string>('google.oauth.clientSecret'),
      redirectUri: this.configService.get<string>('google.oauth.callbackURI'),
    });
  }
}
