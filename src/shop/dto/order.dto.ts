import { PaymentStatus } from 'src/common/enums/shop';
import { CustomerDto } from './customer.dto';
import { OrderItemDto } from './order-item.dto';
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

  items: OrderItemDto[];

  code?: PromotionCodeDto;

  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
}
