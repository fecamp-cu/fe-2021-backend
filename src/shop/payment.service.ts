import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThirdPartyAuthService } from 'src/auth/third-party-auth.service';
import {
  DiscordShopEmbed,
  DiscordShopMessage,
} from 'src/common/constants/discord-message.constant';
import { receiptMessage } from 'src/common/constants/email-message.constant';
import { ServiceType } from 'src/common/enums/service-type';
import { PaymentMessage, PaymentMethod, PaymentStatus, PaymentType } from 'src/common/enums/shop';
import { Discord } from 'src/common/enums/third-party';
import { OmiseException } from 'src/common/exceptions/omise.exception';
import { GoogleEmailRef } from 'src/common/types/google/google-gmail';
import { OmiseCharge } from 'src/common/types/payment';
import { ItemService } from 'src/item/item.service';
import { DiscordService } from 'src/third-party/discord/discord.service';
import { GoogleGmail } from 'src/third-party/google-cloud/google-gmail.service';
import { OmiseService } from 'src/third-party/omise/omise.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CustomerDto } from './dto/customer.dto';
import { OmiseWebhookDto } from './dto/omise-webhook.dto';
import { OrderDto } from './dto/order.dto';
import { PaymentDto } from './dto/payment.dto';
import { Customer } from './entities/customer.entity';
import { OrderService } from './order.service';
import { PromotionCodeService } from './promotion-code.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    private userService: UserService,
    private thirdPartyAuthService: ThirdPartyAuthService,
    private orderService: OrderService,
    private itemService: ItemService,
    private promotionCodeService: PromotionCodeService,
    private omiseService: OmiseService,
    private discordService: DiscordService,
    private googleGmail: GoogleGmail,
  ) {}

  async checkout(paymentDto: PaymentDto, paymentType: PaymentType): Promise<string | OmiseCharge> {
    const totalPrice =
      paymentDto.basket.reduce((acc, item) => acc + item.price * item.quantity, 0) * 100;

    if (paymentType !== PaymentMethod.CREDIT_CARD) {
      paymentDto.source = await this.omiseService.createSource(totalPrice, paymentType);
    }

    const charge: OmiseCharge = await this.omiseService.createCharge(
      paymentDto.source.amount,
      paymentDto.source.id,
      paymentType,
    );

    await this.createOrder(paymentDto, charge);

    return this.getPaymentResult(charge, paymentType);
  }

  async sendReciept(omiseWebhookDto: OmiseWebhookDto): Promise<OrderDto> {
    let order: OrderDto;
    try {
      order = await this.orderService.findByChargeId(omiseWebhookDto.data.id);
    } catch (err) {
      throw new OmiseException(err.message, 'Webhook Error');
    }

    order.transactionId = omiseWebhookDto.data.transaction;
    order.paidAt = omiseWebhookDto.data.paid_at;
    order.status = PaymentStatus.SUCCESS;

    await this.orderService.update(order.id, order);

    const orderDto: OrderDto = await this.orderService.getOrderWithItems(order.id);

    const emailRef: GoogleEmailRef = {
      email: orderDto.customer.email,
      firstname: orderDto.customer.firstname,
      lastname: orderDto.customer.lastname,
    };

    await this.sendEmail(
      emailRef,
      PaymentMessage.RECEIPT,
      receiptMessage(emailRef.firstname, emailRef.lastname, orderDto),
    );

    const author = this.discordService.createAuthor(
      orderDto.customer.firstname + ' ' + orderDto.customer.lastname,
      orderDto.customer.user
        ? orderDto.customer.user.profile.imageUrl
        : Discord.CUSTOMER_ANOYMOUS_AVATAR_URL,
    );

    const embed = DiscordShopEmbed;
    embed.description = DiscordShopMessage(orderDto);
    embed.author = author;

    await this.discordService.sendMessage(
      Discord.SHOP_USERNAME,
      Discord.SHOP_AVATAR_URL,
      Discord.TAG_ADMIN,
      embed,
    );

    return orderDto;
  }

  private async createCustomer(paymentDto: PaymentDto): Promise<CustomerDto> {
    const customer: Customer = await this.customerRepository.findOne({ email: paymentDto.email });

    if (!customer) {
      const customerDto = new CustomerDto({
        firstname: paymentDto.firstName,
        lastname: paymentDto.lastName,
        email: paymentDto.email,
        tel: paymentDto.tel,
        grade: paymentDto.grade,
        school: paymentDto.school,
        address: paymentDto.address,
        subdistrict: paymentDto.subdistrict,
        district: paymentDto.district,
        province: paymentDto.province,
        postcode: paymentDto.postcode,
      });

      const user: UserDto = await this.userService.findByEmail(paymentDto.email);

      if (user) {
        customerDto.user = user;
      }

      const customerInstance = this.customerRepository.create(customerDto);

      return await this.customerRepository.save(customerInstance);
    }

    return customer;
  }

  private getPaymentResult(res: OmiseCharge, paymentType: PaymentType): string | OmiseCharge {
    switch (paymentType) {
      case PaymentMethod.CREDIT_CARD:
        return res;
      case `${PaymentMethod.INTERNET_BANKING}_scb`:
        return res.authorize_uri;
      case `${PaymentMethod.INTERNET_BANKING}_bbl`:
        return res.authorize_uri;
      case `${PaymentMethod.INTERNET_BANKING}_bay`:
        return res.authorize_uri;
      case `${PaymentMethod.INTERNET_BANKING}_ktb`:
        return res.authorize_uri;
      case PaymentMethod.PROMPT_PAY:
        return res.source.scannable_code.image.download_uri;
      default:
        return null;
    }
  }

  public async createOrder(paymentDto: PaymentDto, charge: OmiseCharge): Promise<OrderDto> {
    const ids = await paymentDto.basket.map(item => item.productId);
    const quantities = await paymentDto.basket.map(item => item.quantity);
    const items = await this.itemService.findMulti(ids);
    const customer = await this.createCustomer(paymentDto);

    const orderDto = new OrderDto({
      sourceId: paymentDto.source.id,
      amount: paymentDto.source.amount,
      paymentMethod: paymentDto.source.type,
      customer,
      chargeId: charge.id,
    });

    if (paymentDto.promotionCode) {
      orderDto.code = await this.promotionCodeService.getPromotionCode(paymentDto.promotionCode);
    }

    const createdOrder = await this.orderService.create(orderDto);

    await this.orderService.createMultiOrderItems(items, createdOrder, quantities);
    return createdOrder;
  }

  private async sendEmail(emailRef: GoogleEmailRef, subject: string, message: string[]) {
    let tokenDto = await this.thirdPartyAuthService.getAdminToken(ServiceType.GOOGLE);
    tokenDto = await this.thirdPartyAuthService.validateAndRefreshServiceToken(tokenDto);

    this.googleGmail.sendMessage(subject, message, emailRef, tokenDto);
  }
}
