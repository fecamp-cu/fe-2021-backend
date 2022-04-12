import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmpty, IsIn, IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';
import { PromotionCodeType } from 'src/common/enums/promotion-code';
import { OrderDto } from './order.dto';

export class CreatePromotionCodeDto {
  id: number;

  @ApiProperty({ example: PromotionCodeType.AMOUNT })
  @IsIn([PromotionCodeType.AMOUNT, PromotionCodeType.PERCENTAGE])
  type: PromotionCodeType;

  @ApiProperty({ example: 'FECAMP-2022' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ example: 50 })
  @IsOptional()
  @IsInt()
  value?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isReuseable?: boolean;

  @IsEmpty()
  isActived: boolean;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  startDate: Date;

  @ApiProperty({ example: new Date().toISOString() })
  @IsOptional()
  @IsISO8601()
  expiresDate: Date;

  @IsEmpty()
  order: OrderDto;

  constructor(partial: Partial<CreatePromotionCodeDto>) {
    Object.assign(this, partial);
  }
}
