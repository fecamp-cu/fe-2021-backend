import * as moment from 'moment';
import { OrderDto } from 'src/shop/dto/order.dto';
import { Discord } from '../enums/third-party';
import { DiscordEmbed } from '../types/discord/discord';

export const DiscordEmbedDefaultValue = {
  title: Discord.DEFAULT_TOPIC as string,
  description: Discord.DEFAULT_MESSAGE as string,
  color: Discord.DEFAULT_COLOR as number,
};

export const DiscordShopEmbed: DiscordEmbed = {
  title: Discord.SHOP_TITLE_SOLD as string,
  color: Discord.SHOP_COLOR as number,
};

export const DiscordShopMessage = (orderDto: OrderDto): string => {
  return `
  ขายของออกอีกแล้วววววว 🎉🎉🎉🎉
  คุณ **${orderDto.customer.firstname}** **${
    orderDto.customer.lastname
  }** ได้กดสั่งซื้อของจาก ${'**`FE Shop 🤑`**'} เรียบร้อย
  
  **📌 ข้อมูลทั่วไป**
  - **รหัสการสั่งซื้อ**: ${orderDto.id}
  - **เวลาสั่งซื้อ**: ${moment(orderDto.paidAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
  - **จ่ายโดย**: ${orderDto.paymentMethod}
  
  **🔍 มีรายการดังนี้** ${formatItem(orderDto)}
  💰 รวมเป็นเงินทั้งหมด ${'`' + orderDto.amount / 100 + '`'} บาท`;
};

function formatItem(orderDto: OrderDto) {
  return `
  ${orderDto.items
    .map(
      orderItem =>
        `${'`' + orderItem.item.title + '`'} จำนวน ${'`' + orderItem.quantity + '`'} ชิ้น`,
    )
    .join('\n')}
  `;
}

export const errorMessage = (
  name: string,
  message: string | object,
  path: string,
  status: number,
  stackUrl: string,
) => {
  return `
    **name**: ${name}
    **status**: ${status}
    **message**: ${message}
    **path**: ${path}
    **time**: ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}
    **stack**: ${stackUrl}
  `;
};
