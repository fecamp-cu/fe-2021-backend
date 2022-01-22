import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmpty, IsIn, IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';
import { PromotionCodeType } from 'src/common/enums/promotion-code';
import { OrderDto } from './order.dto';

export class PromotionCodeDto {
  id: number;

  @ApiProperty()
  @IsIn([PromotionCodeType.AMOUNT, PromotionCodeType.PERCENTAGE])
  type: PromotionCodeType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  value?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isReuseable?: boolean;

  @IsEmpty()
  isActived: boolean;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  expiresDate: Date;

  @IsEmpty()
  order: OrderDto;

  constructor(partial: Partial<PromotionCodeDto>) {
    Object.assign(this, partial);
  }
}
