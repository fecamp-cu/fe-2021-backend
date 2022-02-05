import { ItemDto } from 'src/item/dto/item.dto';
import { OrderDto } from 'src/shop/dto/order.dto';
import { UserDto } from 'src/user/dto/user.dto';

export const emailVerifyMessage = (url: string, user: UserDto): string[] => {
  return [
    `Welcome to our FE Camp Family, N. ${user.profile.firstName} ${user.profile.lastName}<br/>`,
    `the next step is you need to verify your email address.<br/>`,
    `please click this link ${url} <br/>`,
  ];
};

export const resetPasswordMessage = (url: string, expireDate: string): string[] => {
  return [
    `You are receiving this email because you have requested a password reset.<br/>`,
    `Please click on the following link to reset your password:<br/>`,
    `This link valid until ${expireDate}<br/>`,
    `${url}`,
  ];
};

export const accountPasswordMessage = (user: UserDto, password: string): string[] => {
  return [
    `Welcome to our FE Camp Family, ${user.profile.firstName} ${user.profile.lastName} <br/>`,
    `your password is ${password}`,
  ];
};

export const receiptMessage = (
  firstname: string,
  lastname: string,
  orderDto: OrderDto,
): string[] => {
  return [
    `Hello ${firstname} ${lastname}, <br/>`,
    `Thank you for your recent transaction on FE Shop <br/>`,
    `Your order number is ${orderDto.id} <br/>`,
    `Please enjoy, your items, ${orderDto.items
      .map(orderItem => showItem(orderItem.item))
      .join(' ')} <br/>`,
    `Hope we will see you again soon! <br/>`,
  ];
};

const showItem = (itemDto: ItemDto): string => {
  return `<br/> <img src="${itemDto.thumbnail}"> <br/> ${itemDto.title}, for ${itemDto.price} Baht <br/>`;
};
