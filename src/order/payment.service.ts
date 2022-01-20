import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThirdPartyAuthService } from 'src/auth/third-party-auth.service';
import { DiscordShopMessage } from 'src/common/constants/discord-message.constant';
import { receiptMessage } from 'src/common/constants/shop-message.constants';
import { ServiceType } from 'src/common/enums/service-type';
import { PaymentMessage, PaymentStatus } from 'src/common/enums/shop';
import { Discord } from 'src/common/enums/third-party';
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
import { OrderDto } from './dto/order.dto';
import { PaymentCompleteDto } from './dto/payment-complete.dto';
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

  async checkoutInternetBanking(paymentDto: PaymentDto): Promise<string> {
    // TODO Create customer if doesn't exist

    const ids = await paymentDto.basket.map(item => item.productId);
    const items = await this.itemService.findMulti(ids);
    const customer = await this.createCustomer(paymentDto);

    const orderDto = new OrderDto({
      sourceId: paymentDto.source.id,
      amount: paymentDto.source.amount,
      paymentMethod: paymentDto.source.type,
      items,
      customer,
    });

    if (paymentDto.promotionCode) {
      orderDto.code = await this.promotionCodeService.getPromotionCode(paymentDto.promotionCode);
    }

    await this.orderService.create(orderDto);

    const authorize_uri = await this.omiseService.createInternetBankingCharge(
      paymentDto.source.amount,
      paymentDto.source.id,
    );

    return authorize_uri;
  }

  async checkoutPromptPay(paymentDto: PaymentDto): Promise<string> {
    // TODO Create customer if doesn't exist

    const ids = await paymentDto.basket.map(item => item.productId);
    const items = await this.itemService.findMulti(ids);
    const customer = await this.createCustomer(paymentDto);

    const orderDto = new OrderDto({
      sourceId: paymentDto.source.id,
      amount: paymentDto.source.amount,
      paymentMethod: paymentDto.source.type,
      items,
      customer,
    });

    if (paymentDto.promotionCode) {
      orderDto.code = await this.promotionCodeService.getPromotionCode(paymentDto.promotionCode);
    }

    await this.orderService.create(orderDto);

    const download_uri = await this.omiseService.createPromptPayCharge(
      paymentDto.source.amount,
      paymentDto.source.id,
    );

    return download_uri;
  }

  async checkoutCreditCard(paymentDto: PaymentDto): Promise<boolean> {
    // TODO Create customer if doesn't exist

    const ids = await paymentDto.basket.map(item => item.productId);
    const items = await this.itemService.findMulti(ids);
    const customer = await this.createCustomer(paymentDto);

    const orderDto = new OrderDto({
      sourceId: paymentDto.source.id,
      amount: paymentDto.source.amount,
      paymentMethod: paymentDto.source.type,
      items,
      customer,
    });

    if (paymentDto.promotionCode) {
      orderDto.code = await this.promotionCodeService.getPromotionCode(paymentDto.promotionCode);
    }

    await this.orderService.create(orderDto);

    const res = await this.omiseService.createCreditCardCharge(
      paymentDto.source.amount,
      paymentDto.source.id,
    );

    res.source = { id: paymentDto.source.id };

    await this.sendRecieptCreditCard(res);

    return true;
  }

  async sendReciept(paymentCompleteDto: PaymentCompleteDto): Promise<OrderDto> {
    // TODO Implement for token payment

    const order = await this.orderService.findBySourceId(paymentCompleteDto.data.source.id);

    order.chargeId = paymentCompleteDto.data.id;
    order.transactionId = paymentCompleteDto.data.transaction;
    order.paidAt = paymentCompleteDto.data.paid_at;
    order.status = PaymentStatus.SUCCESS;

    const orderDto = await this.orderService.update(order.id, order, ['customer', 'items']);

    const emailRef: GoogleEmailRef = {
      email: orderDto.customer.email,
      firstname: orderDto.customer.firstname,
      lastname: orderDto.customer.lastname,
    };

    // TODO send email and webhook

    await this.sendEmail(
      emailRef,
      PaymentMessage.RECEIPT,
      receiptMessage(emailRef.firstname, emailRef.lastname, orderDto),
    );

    await this.discordService.sendMessage(
      Discord.SHOP_USERNAME,
      Discord.SHOP_AVATAR_URL,
      DiscordShopMessage(orderDto),
    );

    return orderDto;
  }

  async sendRecieptCreditCard(paidCharge: OmiseCharge): Promise<OrderDto> {
    // TODO Implement for token payment

    const order = await this.orderService.findBySourceId(paidCharge.source.id);

    order.chargeId = paidCharge.id;
    order.transactionId = paidCharge.transaction;
    order.paidAt = paidCharge.paid_at;
    order.status = PaymentStatus.SUCCESS;

    const orderDto = await this.orderService.update(order.id, order, ['customer', 'items']);

    const emailRef: GoogleEmailRef = {
      email: orderDto.customer.email,
      firstname: orderDto.customer.firstname,
      lastname: orderDto.customer.lastname,
    };

    // TODO send email and webhook

    await this.sendEmail(
      emailRef,
      PaymentMessage.RECEIPT,
      receiptMessage(emailRef.firstname, emailRef.lastname, orderDto),
    );

    await this.discordService.sendMessage(
      Discord.SHOP_USERNAME,
      Discord.SHOP_AVATAR_URL,
      DiscordShopMessage(orderDto),
    );

    return orderDto;
  }

  async getAllCharges(): Promise<OmiseCharge[]> {
    return this.omiseService.getAllCharages();
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

  private async sendEmail(emailRef: GoogleEmailRef, subject: string, message: string[]) {
    let tokenDto = await this.thirdPartyAuthService.getAdminToken(ServiceType.GOOGLE);
    tokenDto = await this.thirdPartyAuthService.validateAndRefreshServiceToken(tokenDto);

    this.googleGmail.sendMessage(subject, message, emailRef, tokenDto);
  }
}
