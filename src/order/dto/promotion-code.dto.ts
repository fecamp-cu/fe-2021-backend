import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PromotionCodeType } from 'src/common/enums/promotion-code';
import { OrderDto } from './order.dto';

export class PromotionCodeDto {
  id: number;

  @ApiProperty()
  @IsNotEmpty()
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
  @IsNotEmpty()
  isReuseable: boolean;

  @IsEmpty()
  isActived: boolean;

  @ApiProperty()
  @IsNotEmpty()
  expiresDate: Date;

  @IsEmpty()
  order: OrderDto;

  constructor(partial: Partial<PromotionCodeDto>) {
    Object.assign(this, partial);
  }
}
