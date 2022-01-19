import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { OrderDto } from './dto/order.dto';
import { PaymentCompleteDto } from './dto/payment-complete.dto';
import { PaymentDto } from './dto/payment.dto';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  constructor(
    private readonly orderService: OrderService,
    private paymentService: PaymentService,
  ) {}

  @Post()
  create(@Body() orderDto: OrderDto) {
    return this.orderService.create(orderDto);
  }

  @Post('checkout')
  async checkout(@Body() paymentDto: PaymentDto, @Res() res: Response) {
    const authorize_uri = await this.paymentService.checkout(paymentDto);
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(authorize_uri);
  }

  @Post('omise/callback')
  async callback(@Body() paymentCompleteDto: PaymentCompleteDto, @Res() res: Response) {
    if (paymentCompleteDto.data.status === 'successful') {
      this.paymentService.sendReciept(paymentCompleteDto);
    }
    return res.status(HttpStatus.OK).json(paymentCompleteDto);
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
