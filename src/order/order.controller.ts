import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService, private paymentService: PaymentService) {}

  @Get('charges')
  @CheckPolicies(new ManagePolicyHandler())
  getAllCharge() {
    return this.paymentService.getAllCharges();
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManagePolicyHandler())
  update(@Param('id') id: string, @Body() orderDto: OrderDto) {
    return this.orderService.update(+id, orderDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
