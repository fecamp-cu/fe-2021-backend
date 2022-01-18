export const DiscordShopMessage = (user: string, orderId: string): string => {
  return `${user} ได้สั่งซื้อสินค้าเรียบร้อยแล้ว รหัสการสั่งซื้อของคุณคือ ${orderId}`;
};
