import { Body, Controller, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeaders,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { PaymentType } from 'src/common/enums/shop';
import { OmiseCharge } from 'src/common/types/payment';
import { OmiseWebhookDto } from './dto/omise-webhook.dto';
import { OrderDto } from './dto/order.dto';
import { PaymentDto } from './dto/payment.dto';
import { PromotionCodeDto } from './dto/promotion-code.dto';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { PromotionCodeService } from './promotion-code.service';

@ApiTags('Shop')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('shop')
export class ShopController {
  constructor(
    private readonly orderService: OrderService,
    private promotionCodeService: PromotionCodeService,
    private paymentService: PaymentService,
    private configService: ConfigService,
  ) {}

  @Post()
  @Public()
  create(@Body() orderDto: OrderDto) {
    return this.orderService.create(orderDto);
  }

  @ApiOkResponse({
    description: 'Successfully checkout with internet banking payment method',
    schema: {
      properties: { authorize_uri: { type: 'string', example: 'https://www.omise.co/pay' } },
    },
  })
  @Post('checkout/internet-banking')
  @Public()
  async checkoutInternetBanking(@Body() paymentDto: PaymentDto, @Res() res: Response) {
    const authorize_uri: string = (await this.paymentService.checkout(
      paymentDto,
      PaymentType.INTERNET_BANKING,
    )) as string;
    return res.status(HttpStatus.OK).json({ authorize_uri });
  }

  @ApiOkResponse({
    description: 'Successfully checkout with promptpay method',
    schema: {
      properties: { download_uri: { type: 'string', example: 'https://qrcode-uri.com' } },
    },
  })
  @Post('checkout/promptpay')
  @Public()
  async checkoutPromptPay(@Body() paymentDto: PaymentDto, @Res() res: Response) {
    const download_uri: string = (await this.paymentService.checkout(
      paymentDto,
      PaymentType.PROMPT_PAY,
    )) as string;
    return res.status(HttpStatus.OK).json({ download_uri });
  }

  @Post('checkout/credit-card')
  @Public()
  async checkoutCreditCard(@Body() paymentDto: PaymentDto, @Res() res: Response) {
    const charge = await this.paymentService.checkout(paymentDto, PaymentType.CREDIT_CARD);

    const omiseWebhookDto: OmiseWebhookDto = new OmiseWebhookDto({
      data: charge as OmiseCharge,
    });

    await this.paymentService.sendReciept(omiseWebhookDto);
    res
      .status(HttpStatus.MOVED_PERMANENTLY)
      .redirect(this.configService.get<string>('app.url') + '/payment/success');
  }

  @Post('omise/callback')
  @Public()
  async callback(@Body() omiseWebhookDto: OmiseWebhookDto, @Res() res: Response) {
    if (omiseWebhookDto.data.status === 'successful' && omiseWebhookDto.data.source) {
      this.paymentService.sendReciept(omiseWebhookDto);
    }
    return res.status(HttpStatus.OK).json(omiseWebhookDto);
  }

  @ApiCreatedResponse({
    description: 'Successfully created promotion code',
    type: PromotionCodeDto,
  })
  @ApiBearerAuth()
  @Post('/generate-code')
  @CheckPolicies(new ManagePolicyHandler())
  async generateCode(@Body() promotionCodeDto: PromotionCodeDto, @Res() res: Response) {
    const promotionCode: PromotionCodeDto = await this.promotionCodeService.generate(
      promotionCodeDto.type,
      promotionCodeDto.expiresDate,
      promotionCodeDto.isReuseable,
      promotionCodeDto.code,
      promotionCodeDto.value,
    );
    return res.status(HttpStatus.CREATED).json(promotionCode);
  }

  @ApiOkResponse({
    description: 'Successfully redeem promotion code',
    type: PromotionCodeDto,
  })
  @Post('/verify/:code')
  @Public()
  async verifyPromotionCode(@Param('code') code: string, @Res() res: Response) {
    const promotionCode: PromotionCodeDto = await this.promotionCodeService.use(code);
    return res.status(HttpStatus.OK).json(promotionCode);
  }
}
