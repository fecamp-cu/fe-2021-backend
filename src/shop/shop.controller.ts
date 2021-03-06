import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import { PaymentMethod } from 'src/common/enums/shop';
import { OmiseCharge } from 'src/common/types/payment';
import { CreatePromotionCodeDto } from './dto/create-promotion-code.dto';
import { OmiseWebhookDto } from './dto/omise-webhook.dto';
import { OrderDto } from './dto/order.dto';
import { PaymentDto } from './dto/payment.dto';
import { UpdatePromotionCodeDto } from './dto/update-promotion-code.dto';
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
      `${PaymentMethod.INTERNET_BANKING}_${paymentDto.bank}`,
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
      PaymentMethod.PROMPT_PAY,
    )) as string;
    return res.status(HttpStatus.OK).json({ download_uri });
  }

  @Post('checkout/credit-card')
  @Public()
  async checkoutCreditCard(@Body() paymentDto: PaymentDto, @Res() res: Response) {
    const charge = await this.paymentService.checkout(paymentDto, PaymentMethod.CREDIT_CARD);

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
    type: CreatePromotionCodeDto,
  })
  @ApiBearerAuth()
  @Post('/generate-code')
  @CheckPolicies(new ManagePolicyHandler())
  async generateCode(@Body() promotionCodeDto: CreatePromotionCodeDto, @Res() res: Response) {
    const promotionCode = await this.promotionCodeService.generate(promotionCodeDto);
    return res.status(HttpStatus.CREATED).json(promotionCode);
  }

  @ApiBearerAuth()
  @Get('/code')
  @CheckPolicies(new ManagePolicyHandler())
  async findAll(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
    @Res() res: Response,
  ) {
    const promotionCode = await this.promotionCodeService.findWithPaginate({
      page,
      limit,
    });
    return res.status(HttpStatus.OK).json(promotionCode);
  }

  @ApiBearerAuth()
  @Get('/code/:id')
  @CheckPolicies(new ManagePolicyHandler())
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const promotionCode = await this.promotionCodeService.findOne(+id);
    return res.status(HttpStatus.OK).json(promotionCode);
  }

  @ApiBearerAuth()
  @Patch('/code/:id')
  @CheckPolicies(new ManagePolicyHandler())
  async update(
    @Param('id') id: string,
    @Body() promotionCodeDto: UpdatePromotionCodeDto,
    @Res() res: Response,
  ) {
    const promotionCode = await this.promotionCodeService.update(+id, promotionCodeDto);
    return res.status(HttpStatus.OK).json(promotionCode);
  }

  @ApiBearerAuth()
  @Delete('/code/:id')
  @CheckPolicies(new ManagePolicyHandler())
  async delete(@Param('id') id: string, @Res() res: Response) {
    const promotionCode = await this.promotionCodeService.delete(+id);
    return res.status(HttpStatus.OK).json(promotionCode);
  }

  @ApiOkResponse({
    description: 'Successfully redeem promotion code',
    type: CreatePromotionCodeDto,
  })
  @Post('/verify/:code')
  @Public()
  async verifyPromotionCode(@Param('code') code: string, @Res() res: Response) {
    const promotionCode: CreatePromotionCodeDto = await this.promotionCodeService.use(code);
    return res.status(HttpStatus.OK).json(promotionCode);
  }
}
