import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { OmiseCharge } from 'src/common/types/payment';

@Injectable()
export class OmiseService {
  private client;
  constructor(private configService: ConfigService) {
    this.client = axios.create({
      baseURL: 'https://api.omise.co',
      auth: {
        username: this.configService.get<string>('omise.secretKey'),
        password: '',
      },
      withCredentials: true,
    });
  }

  public async getAllCharages(): Promise<OmiseCharge[]> {
    try {
      const res: AxiosResponse = await this.client.get('/charges');
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err.response.data);
    }
  }

  public async createCharge(amount: number, source: string) {
    try {
      const res: AxiosResponse = await this.client.post('/charges', {
        amount: amount,
        currency: 'THB',
        return_uri: this.configService.get<string>('app.url') + '/payment/success',
        source,
      });
      console.log(res.data);
      return res.data.authorize_uri;
    } catch (err) {
      console.log(err.response.data);
    }
  }
}
