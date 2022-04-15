import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable()
export class YoutubeService {
  client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const instance = axios.create({
      baseURL: `https://www.googleapis.com/youtube/v3`,
      withCredentials: true,
    });
    this.client = instance;
  }

  async getVideo(id: string): Promise<AxiosResponse> {
    const res = await this.client.get('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        key: this.configService.get<string>('google.apiKey.youtube'),
        id: id,
      },
    });
    return res;
  }
}
