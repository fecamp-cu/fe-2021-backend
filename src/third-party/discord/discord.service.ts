import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Discord } from 'src/common/enums/third-party';

@Injectable()
export class DiscordService {
  private client;
  constructor(private configService: ConfigService) {
    this.client = axios.create({
      baseURL: this.configService.get<string>('discord.webhookUrl'),
    });
  }

  public async sendMessage(
    username: string = Discord.DEFAULT_USERNAME,
    avatarUrl: string = Discord.DEFAULT_AVATAR_URL,
    content: string = Discord.DEFAULT_MESSAGE,
  ): Promise<boolean> {
    try {
      await this.client.post('', {
        username,
        avatar_url: avatarUrl,
        content,
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}
