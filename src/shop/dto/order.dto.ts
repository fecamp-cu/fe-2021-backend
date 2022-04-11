import { PaymentStatus } from 'src/common/enums/shop';
import { CreatePromotionCodeDto } from './create-promotion-code.dto';
import { CustomerDto } from './customer.dto';
import { OrderItemDto } from './order-item.dto';

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

  code?: CreatePromotionCodeDto;

  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
}
