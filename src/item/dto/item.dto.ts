import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsIn, IsInt, IsString, IsUrl } from 'class-validator';
import { ItemType } from 'src/common/enums/item-type';
import { OrderDto } from 'src/order/dto/order.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { ItemIndexDto } from './item-index.dto';

export class ItemDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsIn([ItemType.EXAM_PREP, ItemType.OLD_PAPERS])
  type: ItemType;

  @ApiProperty()
  @IsUrl()
  thumbnail: string;

  @ApiProperty()
  @IsUrl()
  fileURL: string;

  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsEmpty()
  users?: UserDto[];

  @ApiProperty()
  @IsEmpty()
  indexes?: ItemIndexDto[];

  @ApiProperty()
  @IsEmpty()
  orders?: OrderDto[];

  constructor(partial: Partial<ItemDto>) {
    Object.assign(this, partial);
  }
}
