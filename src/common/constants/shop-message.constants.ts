import { ItemDto } from 'src/item/dto/item.dto';
import { OrderDto } from 'src/order/dto/order.dto';

export const receiptMessage = (
  firstname: string,
  lastname: string,
  orderDto: OrderDto,
): string[] => {
  return [
    `Hello ${firstname} ${lastname}, <br/>`,
    `Thank you for your recent transaction on FE Shop <br/>`,
    `Your order number is ${orderDto.id} <br/>`,
    `Please enjoy, your items, ${orderDto.items.map(item => showItem(item)).join(' ')} <br/>`,
    `Hope we will see you again soon! <br/>`,
  ];
};

const showItem = (itemDto: ItemDto): string => {
  return `<br/> <img src="${itemDto.thumbnail}"> <br/> ${itemDto.title}, for ${itemDto.price} Baht <br/>`;
};
