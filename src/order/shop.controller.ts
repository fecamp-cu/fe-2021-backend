import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PaymentType } from 'src/common/enums/shop';
import { OmiseWebhookDto } from './dto/omise-webhook.dto';
import { OrderDto } from './dto/order.dto';
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
    return res.status(HttpStatus.OK).json({ authorize_uri });
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
    await this.paymentService.checkout(paymentDto, PaymentType.CREDIT_CARD);
    res
      .status(HttpStatus.MOVED_PERMANENTLY)
      .redirect(this.configService.get<string>('app.url') + '/payment/success');
  }

  @Post('omise/callback')
  async callback(@Body() omiseWebhookDto: OmiseWebhookDto, @Res() res: Response) {
    if (omiseWebhookDto.data.status === 'successful') {
      this.paymentService.sendReciept(omiseWebhookDto);
    }
    return res.status(HttpStatus.OK).json(omiseWebhookDto);
  }

  @Post('/generate-code')
  async generateCode(@Body() promotionCodeDto: PromotionCodeDto, @Res() res: Response) {
    const promotionCode = await this.promotionCodeService.generate(
      promotionCodeDto.type,
      promotionCodeDto.expiresDate,
      promotionCodeDto.isReuseable,
      promotionCodeDto.code,
      promotionCodeDto.value,
    );
    return res.status(HttpStatus.CREATED).json(promotionCode);
  }

  @Post('/verify/:code')
  async verifyPromotionCode(@Param('code') code: string, @Res() res: Response) {
    const promotionCode = await this.promotionCodeService.use(code);
    return res.status(HttpStatus.OK).json(promotionCode);
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
