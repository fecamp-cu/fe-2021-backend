import { PaymentStatus } from 'src/common/enums/shop';
import { ItemDto } from 'src/item/dto/item.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { PromotionCodeDto } from './promotion-code.dto';

export class OrderDto {
  id: number;

  email: string;

  sourceId: string;

  chargeId: string;

  transactionId: string;

  paymentMethod: string;

  status: PaymentStatus;

  amount: number;

  paidAt: Date;

  user: UserDto;

  items: ItemDto[];

  code?: PromotionCodeDto;

  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
}
