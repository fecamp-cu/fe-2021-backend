import { PaymentStatus } from 'src/common/enums/shop';
import { ItemDto } from 'src/item/dto/item.dto';
import { CustomerDto } from './customer.dto';
import { PromotionCodeDto } from './promotion-code.dto';

export class OrderDto {
  id: number;

  sourceId: string;

  chargeId: string;

  transactionId: string;

  paymentMethod: string;

  status: PaymentStatus;

  amount: number;

  paidAt: Date;

  customer: CustomerDto;

  items: ItemDto[];

  code?: PromotionCodeDto;

  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
}
