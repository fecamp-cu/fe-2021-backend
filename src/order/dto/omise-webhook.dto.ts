import { OmiseCharge } from 'src/common/types/payment';

export class OmiseWebhookDto {
  object: 'event';

  id: string;

  livemode: false;

  location: string;

  webhook_deliveries: [];

  data: OmiseCharge;

  key: 'charge.create' | 'charge.complete';

  created_at: Date;

  constructor(partial: Partial<OmiseWebhookDto>) {
    Object.assign(this, partial);
  }
}
