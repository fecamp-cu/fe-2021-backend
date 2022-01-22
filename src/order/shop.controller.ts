import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentType } from 'src/common/enums/shop';
import { OmiseCharge } from 'src/common/types/payment';
import { OrderDto } from './dto/order.dto';
import { PaymentCompleteDto } from './dto/payment-complete.dto';
import { PaymentDto } from './dto/payment.dto';
import { PromotionCodeDto } from './dto/promotion-code.dto';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { PromotionCodeService } from './promotion-code.service';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  constructor(
    private readonly orderService: OrderService,
    private promotionCodeService: PromotionCodeService,
    private paymentService: PaymentService,
    private configService: ConfigService,
  ) {}

  @Post()
  create(@Body() orderDto: OrderDto) {
    return this.orderService.create(orderDto);
  }

  @Post('checkout/internet-banking')
  async checkoutInternetBanking(@Body() paymentDto: PaymentDto, @Res() res: Response) {
    const authorize_uri: string = (await this.paymentService.checkout(
      paymentDto,
      PaymentType.INTERNET_BANKING,
    )) as string;
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(authorize_uri);
  }

  @Post('checkout/promptpay')
  async checkoutPromptPay(@Body() paymentDto: PaymentDto, @Res() res: Response) {
    const download_uri: string = (await this.paymentService.checkout(
      paymentDto,
      PaymentType.PROMPT_PAY,
    )) as string;
    return res.status(HttpStatus.OK).json({ download_uri });
  }

  @Post('checkout/credit-card')
  async checkoutCreditCard(@Body() paymentDto: PaymentDto, @Res() res: Response) {
    (await this.paymentService.checkout(paymentDto, PaymentType.CREDIT_CARD)) as OmiseCharge;
    res
      .status(HttpStatus.MOVED_PERMANENTLY)
      .redirect(this.configService.get<string>('app.url') + '/payment/success');
  }

  @Post('omise/callback')
  async callback(@Body() paymentCompleteDto: PaymentCompleteDto, @Res() res: Response) {
    if (paymentCompleteDto.data.status === 'successful') {
      this.paymentService.sendReciept(paymentCompleteDto);
    }
    return res.status(HttpStatus.OK).json(paymentCompleteDto);
  }

  @Post('/generate-code')
  async generateCode(@Body() promotionCodeDto: PromotionCodeDto) {
    const promotionCode = await this.promotionCodeService.generate(
      promotionCodeDto.type,
      promotionCodeDto.expiresDate,
      promotionCodeDto.isReuseable,
      promotionCodeDto.code,
      promotionCodeDto.value,
    );
    return promotionCode;
  }

  @Post('/verify/:code')
  async verifyPromotionCode(@Param('code') code: string) {
    const promotionCode = await this.promotionCodeService.use(code);
    return promotionCode;
  }

  @Get('charges')
  getAllCharge() {
    return this.paymentService.getAllCharges();
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() orderDto: OrderDto) {
    return this.orderService.update(+id, orderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
