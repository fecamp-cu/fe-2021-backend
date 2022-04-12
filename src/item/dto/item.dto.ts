import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsIn, IsInt, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { ItemType } from 'src/common/enums/item-type';
import { OrderItemDto } from 'src/shop/dto/order-item.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { ItemIndexDto } from './item-index.dto';

export class ItemDto {
  id: number;

  @ApiProperty({ example: ItemType.EXAM_PREP, enum: ItemType })
  @IsIn([ItemType.EXAM_PREP, ItemType.OLD_PAPERS])
  type: ItemType;

  @ApiProperty({ example: 'https://www.imgurl.com/img.png' })
  @IsUrl()
  @IsOptional()
  thumbnail: string;

  @ApiProperty({ example: 'https://www.imgurl.com/img.png' })
  @IsUrl()
  @IsOptional()
  fileURL: string;

  @ApiProperty({ example: 300 })
  @IsInt()
  price: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  quantityInStock: number;

  @ApiProperty({ example: 'Fe Camp Book' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'The pre exam preparation book' })
  @IsString()
  summary: string;

  @ApiProperty({ example: 'FE Staff' })
  @IsString()
  author: string;

  @ApiProperty()
  @ValidateNested()
  indexes?: ItemIndexDto[];

  @IsEmpty()
  users?: UserDto[];

  @IsEmpty()
  orders?: OrderItemDto[];

  constructor(partial: Partial<ItemDto>) {
    Object.assign(this, partial);
  }
}
