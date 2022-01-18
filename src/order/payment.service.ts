import { Injectable } from '@nestjs/common';
import { PaymentStatus } from 'src/common/enums/shop';
import { OmiseCharge } from 'src/common/types/payment';
import { ItemService } from 'src/item/item.service';
import { DiscordService } from 'src/third-party/discord/discord.service';
import { GoogleGmail } from 'src/third-party/google-cloud/google-gmail.service';
import { OmiseService } from 'src/third-party/omise/omise.service';
import { UserService } from 'src/user/user.service';
import { OrderDto } from './dto/order.dto';
import { PaymentCompleteDto } from './dto/payment-complete.dto';
import { PaymentDto } from './dto/payment.dto';
import { OrderService } from './order.service';
import { PromotionCodeService } from './promotion-code.service';

@Injectable()
export class PaymentService {
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private itemService: ItemService,
    private promotionCodeService: PromotionCodeService,
    private omiseService: OmiseService,
    private discordService: DiscordService,
    private googleGmail: GoogleGmail,
  ) {}

  async checkout(paymentDto: PaymentDto): Promise<string> {
    const ids = await paymentDto.basket.map(item => item.productId);
    const items = await this.itemService.findMulti(ids);

    const orderDto = new OrderDto({
      email: paymentDto.email,
      sourceId: paymentDto.source.id,
      amount: paymentDto.source.amount,
      paymentMethod: paymentDto.source.type,
      items,
    });

    const user = await this.userService.findByEmail(paymentDto.email);

    if (user) {
      orderDto.user = user;
    }

    if (paymentDto.promotionCode) {
      orderDto.code = await this.promotionCodeService.getPromotionCode(paymentDto.promotionCode);
    }

    await this.orderService.create(orderDto);

    const authorize_uri = await this.omiseService.createCharge(
      paymentDto.source.amount,
      paymentDto.source.id,
    );

    return authorize_uri;
  }

  async sendReciept(paymentCompleteDto: PaymentCompleteDto): Promise<OrderDto> {
    const order = await this.orderService.findBySourceId(paymentCompleteDto.data.source.id);

    order.chargeId = paymentCompleteDto.data.id;
    order.transactionId = paymentCompleteDto.data.transaction;
    order.paidAt = paymentCompleteDto.data.paid_at;
    order.status = PaymentStatus.SUCCESS;

    const orderDto = await this.orderService.update(order.id, order);

    // TODO send email and webhook

    return orderDto;
  }

  private async sendWebhook(): Promise<void> {
    await this.discordService.sendMessage();
  }

  async getAllCharges(): Promise<OmiseCharge[]> {
    return this.omiseService.getAllCharages();
  }

  async createOrder(paymentDto: PaymentDto): Promise<void> {
    const orderDto = new OrderDto({
      amount: paymentDto.source.amount,
    });
    await this.orderService.create(orderDto);
  }
}
