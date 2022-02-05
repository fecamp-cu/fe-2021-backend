import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { ItemDto } from './item.dto';

export class ItemIndexDto {
  id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  order: number;

  @ApiProperty({ example: 'Ep 1 - Introduction' })
  @IsString()
  text: string;

  item: ItemDto;

  constructor(partial: Partial<ItemIndexDto>) {
    Object.assign(this, partial);
  }
}
