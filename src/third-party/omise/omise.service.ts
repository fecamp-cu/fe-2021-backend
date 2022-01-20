import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { OmiseCharge, OmiseSource } from 'src/common/types/payment';

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
      return res.data;
    } catch (err) {
      console.log(err.response.data);
    }
  }

  public async getCharge(id: string): Promise<OmiseCharge> {
    try {
      const res: AxiosResponse = await this.client.get(`/charges/${id}`);
      return res.data;
    } catch (err) {
      console.log(err.response.data);
    }
  }

  public async getSource(id: string): Promise<OmiseSource> {
    try {
      const res: AxiosResponse = await this.client.get(`/sources/${id}`);
      return res.data;
    } catch (err) {
      console.log(err.response.data);
    }
  }

  public async createInternetBankingCharge(amount: number, source: string) {
    try {
      const res: AxiosResponse = await this.client.post('/charges', {
        amount,
        currency: 'THB',
        return_uri: this.configService.get<string>('app.url') + '/payment/success',
        source,
      });
      return res.data.authorize_uri;
    } catch (err) {
      console.log(err.response.data);
    }
  }

  // TODO create function for promptpay and credit card

  public async createPromptPayCharge(amount: number, source: string) {
    try {
      const res: AxiosResponse = await this.client.post('/charges', {
        amount,
        currency: 'THB',
        return_uri: this.configService.get<string>('app.url') + '/payment/success',
        source,
      });
      return res.data.source.scannable_code.image.download_uri;
    } catch (err) {
      console.log(err.response.data);
    }
  }

  public async createCreditCardCharge(amount: number, token: string) {
    try {
      const res: AxiosResponse = await this.client.post('/charges', {
        amount,
        currency: 'THB',
        return_uri: this.configService.get<string>('app.url') + '/payment/success',
        card: token,
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err.response.data);
    }
  }
}
