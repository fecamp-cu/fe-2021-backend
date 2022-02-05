import { ItemDto } from 'src/item/dto/item.dto';
import { OrderDto } from './order.dto';

export class OrderItemDto {
  id: number;

  quantity: number;

  item: ItemDto;

  order: OrderDto;

  constructor(partial: Partial<OrderItemDto>) {
    Object.assign(this, partial);
  }
}
