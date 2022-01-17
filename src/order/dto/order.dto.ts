import { IsDate, IsEmpty, IsInt, IsString } from 'class-validator';
import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/user/entities/user.entity';
import { PromotionCodeDto } from './promotion-code.dto';

export class OrderDto {
  id: number;

  @IsString()
  chargeId: string;

  @IsString()
  transactionId: string;

  @IsString()
  paymentMethod: string;

  @IsInt()
  amount: number;

  @IsDate()
  paid_at: Date;

  @IsEmpty()
  user: User;

  @IsEmpty()
  items: Item[];

  @IsEmpty()
  code: PromotionCodeDto;

  constructor(partial: Partial<OrderDto>) {
    Object.assign(this, partial);
  }
}
