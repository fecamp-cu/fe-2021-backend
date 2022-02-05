import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { TokenDto } from 'src/auth/dto/token.dto';
import { GoogleEmailRef } from 'src/common/types/google/google-gmail';
import { GoogleAuthentication } from './google-auth.service';

@Injectable()
export class GoogleGmail {
  private client;
  constructor(private googleAuthService: GoogleAuthentication) {
    this.client = google.gmail({ version: 'v1', auth: this.googleAuthService.getClient() });
  }

  //** Assume token is valid **//

  public async sendMessage(
    topic: string,
    message: string[],
    target: GoogleEmailRef,
    tokenDto: TokenDto,
  ): Promise<any> {
    this.googleAuthService.setCredentialsByDTO(tokenDto);
    const subject = topic;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const headerParts = [
      'From: Fe Camp Team <fecamp-2021@gmail.com>',
      `To: ${target.firstname} ${target.lastname} <${target.email}>`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
    ];

    message = headerParts.concat(message);

    const encodedMessage = Buffer.from(message.join('\n'))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const res = await this.client.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log(res.data);
    return res.data;
  }
}
