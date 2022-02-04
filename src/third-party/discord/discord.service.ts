import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DiscordEmbedDefaultValue } from 'src/common/constants/discord-message.constant';
import { Discord } from 'src/common/enums/third-party';
import {
  DiscordEmbed,
  DiscordEmbedAuthor,
  DiscordEmbedFooter,
  DiscordWebhookPayload,
} from 'src/common/types/discord/discord';

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
    content: string = '',
    embed: DiscordEmbed = DiscordEmbedDefaultValue,
  ): Promise<boolean> {
    const data: DiscordWebhookPayload = {
      username,
      avatar_url: avatarUrl,
      content,
      embeds: [embed],
      allowed_mentions: {
        parse: ['roles'],
      },
    };

    try {
      await this.client.post('', data);
      return true;
    } catch (err) {
      console.error(err.response.data);
      return false;
    }
  }

  public createEmbed(
    title: string,
    description: string,
    color: number,
    author?: DiscordEmbedAuthor,
    footer?: DiscordEmbedFooter,
  ): DiscordEmbed {
    const embed: DiscordEmbed = {
      title,
      description,
      color,
    };

    if (author) {
      embed.author = author;
    }

    if (footer) {
      embed.footer = footer;
    }

    return embed;
  }

  public createFooter(text: string, icon_url) {
    return {
      text,
      icon_url,
    };
  }

  public createAuthor(name: string, icon_url: string, url?: string) {
    return {
      name,
      icon_url,
      url,
    };
  }
}
