import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsIn, IsInt, IsString, IsUrl } from 'class-validator';
import { ItemType } from 'src/common/enums/item-type';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { ItemIndex } from '../entities/item-index.entity';

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
  users?: User;

  @ApiProperty()
  @IsEmpty()
  indexes?: ItemIndex[];

  @ApiProperty()
  @IsEmpty()
  orders?: Order[];

  constructor(partial: Partial<ItemDto>) {
    Object.assign(this, partial);
  }
}
