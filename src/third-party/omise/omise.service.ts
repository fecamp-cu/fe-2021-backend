import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PaymentMethod, PaymentType } from 'src/common/enums/shop';
import { OmiseException } from 'src/common/exceptions/omise.exception';
import { ChargeRequest, OmiseCharge, OmiseSource, SourceRequest } from 'src/common/types/payment';

@Injectable()
export class OmiseService {
  private client: AxiosInstance;
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
      throw new OmiseException(err.response.data.message);
    }
  }

  public async getAllTransaction(): Promise<OmiseCharge[]> {
    try {
      const res: AxiosResponse = await this.client.get('/transactions');
      return res.data;
    } catch (err) {
      console.log(err.response.data);
      throw new OmiseException(err.response.data.message);
    }
  }

  public async getCharge(id: string): Promise<OmiseCharge> {
    try {
      const res: AxiosResponse = await this.client.get(`/charges/${id}`);
      return res.data;
    } catch (err) {
      console.log(err.response.data);
      throw new OmiseException(err.response.data.message);
    }
  }

  public async getTransaction(id: string): Promise<OmiseCharge> {
    try {
      const res: AxiosResponse = await this.client.get(`/transactions/${id}`);
      return res.data;
    } catch (err) {
      console.log(err.response.data);
      throw new OmiseException(err.response.data.message);
    }
  }

  public async getSource(id: string): Promise<OmiseSource> {
    try {
      const res: AxiosResponse = await this.client.get(`/sources/${id}`);
      return res.data;
    } catch (err) {
      console.log(err.response.data);
      throw new OmiseException(err.response.data.message);
    }
  }

  public async createSource(amount: number, paymentType: PaymentType): Promise<OmiseSource> {
    try {
      const res = await this.sendSource(amount, paymentType);
      return res.data as OmiseSource;
    } catch (err) {
      throw new OmiseException(err.response.data.message, 'Omise Source Error');
    }
  }

  public async createCharge(
    amount: number,
    source: string,
    paymentType: PaymentType,
  ): Promise<OmiseCharge> {
    let isCreditCard = false;
    if (paymentType === PaymentMethod.CREDIT_CARD) {
      isCreditCard = true;
    }
    const res: OmiseCharge = await this.sendCharge(amount, source, isCreditCard);

    return res;
  }

  async sendSource(amount: number, paymentType: PaymentType): Promise<AxiosResponse> {
    const data: SourceRequest = {
      amount,
      currency: 'THB',
      type: paymentType,
    };

    const res: AxiosResponse = await this.client.post('/sources', data);
    return res;
  }

  async sendCharge(
    amount: number,
    sourceIdOrTokenId: string,
    isCreditCard: boolean,
  ): Promise<OmiseCharge> {
    const data: ChargeRequest = {
      amount,
      currency: 'THB',
    };

    if (isCreditCard) {
      data.card = sourceIdOrTokenId;
    }

    if (!isCreditCard) {
      data.source = sourceIdOrTokenId;
      data.return_uri = this.configService.get<string>('app.url') + '/payment/success';
    }

    try {
      const res: AxiosResponse = await this.client.post('/charges', data);
      return res.data;
    } catch (err) {
      console.log(err.response.data);
      throw new OmiseException(err.response.data.message, 'Omise Charge Error');
    }
  }
}
