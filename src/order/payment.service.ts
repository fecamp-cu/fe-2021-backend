import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThirdPartyAuthService } from 'src/auth/third-party-auth.service';
import { DiscordShopMessage } from 'src/common/constants/discord-message.constant';
import { receiptMessage } from 'src/common/constants/shop-message.constants';
import { ServiceType } from 'src/common/enums/service-type';
import { PaymentMessage, PaymentStatus, PaymentType } from 'src/common/enums/shop';
import { Discord } from 'src/common/enums/third-party';
import { GoogleEmailRef } from 'src/common/types/google/google-gmail';
import { OmiseCharge, OmiseSource } from 'src/common/types/payment';
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

  async checkout(paymentDto: PaymentDto, paymentType: PaymentType): Promise<string | OmiseCharge> {
    await this.createOrder(paymentDto);

    const charge: OmiseCharge = await this.omiseService.createCharge(
      paymentDto.source.amount,
      paymentDto.source.id,
      paymentType,
    );

    if (paymentType === PaymentType.CREDIT_CARD) {
      charge.source = { id: paymentDto.source.id } as OmiseSource;
      this.sendReciept(new PaymentCompleteDto({ data: charge }));
    }
    return this.getPaymentResult(charge, paymentType);
  }

  async sendReciept(paymentCompleteDto: PaymentCompleteDto): Promise<OrderDto> {
    const order = await this.orderService.findBySourceId(paymentCompleteDto.data.source.id);

    order.chargeId = paymentCompleteDto.data.id;
    order.transactionId = paymentCompleteDto.data.transaction;
    order.paidAt = paymentCompleteDto.data.paid_at;
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

  private getPaymentResult(res: OmiseCharge, paymentType: PaymentType): string | OmiseCharge {
    switch (paymentType) {
      case PaymentType.CREDIT_CARD:
        return res;
      case PaymentType.INTERNET_BANKING:
        return res.authorize_uri;
      case PaymentType.PROMPT_PAY:
        return res.source.scannable_code.image.download_uri;
      default:
        return null;
    }
  }

  private async createOrder(paymentDto: PaymentDto): Promise<OrderDto> {
    const ids = await paymentDto.basket.map(item => item.productId);
    const quantities = await paymentDto.basket.map(item => item.quantity);
    const items = await this.itemService.findMulti(ids);
    const customer = await this.createCustomer(paymentDto);

    const orderDto = new OrderDto({
      sourceId: paymentDto.source.id,
      amount: paymentDto.source.amount,
      paymentMethod: paymentDto.source.type,
      customer,
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