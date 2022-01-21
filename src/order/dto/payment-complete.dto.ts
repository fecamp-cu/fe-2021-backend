import { OmiseCharge } from 'src/common/types/payment';

export class PaymentCompleteDto {
  object: 'event';

  id: string;

  livemode: false;

  location: string;

  webhook_deliveries: [];

  data: OmiseCharge;

  key: 'charge.complete';

  created_at: Date;

  constructor(partial: Partial<PaymentCompleteDto>) {
    Object.assign(this, partial);
  }
}
