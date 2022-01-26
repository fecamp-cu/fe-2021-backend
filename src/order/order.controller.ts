import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';

@UseGuards(JwtAuthGuard, PoliciesGuard)
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