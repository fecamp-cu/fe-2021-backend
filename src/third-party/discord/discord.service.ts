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
    title: string = Discord.DEFAULT_TOPIC,
    description: string = Discord.DEFAULT_MESSAGE,
    color: number = Discord.DEFAULT_COLOR,
    content: string = '',
  ): Promise<boolean> {
    console.log(content);
    try {
      await this.client.post('', {
        username,
        avatar_url: avatarUrl,
        // content,
        embeds: [{ title, description, color }],
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}
