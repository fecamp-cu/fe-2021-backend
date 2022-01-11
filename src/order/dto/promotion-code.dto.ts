import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString } from 'class-validator';
import { PromotionCodeType } from 'src/common/enums/promotion-code';
import { OrderDto } from './order.dto';

export class PromotionCodeDto {
  id: number;

  @ApiProperty()
  @IsEmpty()
  type: PromotionCodeType;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsEmpty()
  value: number;

  @IsEmpty()
  isActived: boolean;

  @ApiProperty()
  @IsEmpty()
  expiresDate: Date;

  @IsEmpty()
  order: OrderDto;

  constructor(partial: Partial<PromotionCodeDto>) {
    Object.assign(this, partial);
  }
}