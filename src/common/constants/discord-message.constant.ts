import { OrderDto } from 'src/order/dto/order.dto';

export const DiscordShopMessage = (orderDto: OrderDto): string => {
  return `
  คุณ ${orderDto.customer.firstname} ${orderDto.customer.lastname} ได้สั่งซื้อสินค้าเรียบร้อยแล้ว
  ชนิดของสินค้า คือ ${orderDto.items.map(orderItem => orderItem.item.title).join(' ')}
  จำนวน ${orderDto.amount} ชิ้น
  รหัสการสั่งซื้อคือ ${orderDto.id}`;
};
