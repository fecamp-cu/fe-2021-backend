import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsIn, IsInt, IsString, IsUrl, ValidateNested } from 'class-validator';
import { ItemType } from 'src/common/enums/item-type';
import { OrderItemDto } from 'src/shop/dto/order-item.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { ItemIndexDto } from './item-index.dto';

export class ItemDto {
  id: number;

  @ApiProperty({
    example: ItemType.EXAM_PREP,
    description: 'The type of the item',
    enum: ItemType,
  })
  @IsIn([ItemType.EXAM_PREP, ItemType.OLD_PAPERS])
  type: ItemType;

  @ApiProperty({
    example: 'https://www.imgurl.com/img.png',
    description: 'URL of the item picture',
  })
  @IsUrl()
  thumbnail: string;

  @ApiProperty({
    example: 'https://www.imgurl.com/img.png',
    description: 'URL of the file',
  })
  @IsUrl()
  fileURL: string;

  @ApiProperty({
    example: 300,
    description: 'Price of the item',
  })
  @IsInt()
  price: number;

  @ApiProperty({
    example: 'Fe Camp Book',
    description: 'Title of the item',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'The pre exam preparation book',
    description: 'Description of the item',
  })
  @IsString()
  summary: string;

  @ApiProperty({
    example: 'FE Staff',
    description: 'Author of the item',
  })
  @IsString()
  author: string;

  @ApiProperty({
    description: 'The index of the item',
  })
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
