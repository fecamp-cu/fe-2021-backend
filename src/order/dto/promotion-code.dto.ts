import { IsEmpty, IsIn, IsString } from 'class-validator';
import { PromotionCodeType } from 'src/common/enums/promotion-code';
import { OrderDto } from './order.dto';

export class PromotionCodeDto {
  id: number;

  @IsIn([PromotionCodeType.AMOUNT, PromotionCodeType.PERCENTAGE])
  type: PromotionCodeType;

  @IsString()
  code: string;

  @IsEmpty()
  value: number;

  @IsEmpty()
  isActived: boolean;

  @IsEmpty()
  expiresDate: Date;

  @IsEmpty()
  order: OrderDto;

  constructor(partial: Partial<PromotionCodeDto>) {
    Object.assign(this, partial);
  }
}
