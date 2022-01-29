import * as moment from 'moment';
import { OrderDto } from 'src/shop/dto/order.dto';

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
