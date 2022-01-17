import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { ItemDto } from './item.dto';

export class ItemIndexDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsInt()
  order: number;

  @ApiProperty()
  @IsString()
  text: string;

  item: ItemDto;

  constructor(partial: Partial<ItemIndexDto>) {
    Object.assign(this, partial);
  }
}
