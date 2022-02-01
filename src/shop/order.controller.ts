import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { OmiseService } from 'src/third-party/omise/omise.service';
import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService, private omiseService: OmiseService) {}

  @Get('charge')
  @CheckPolicies(new ManagePolicyHandler())
  getAllCharge() {
    return this.omiseService.getAllCharages();
  }

  @Get('charge/:id')
  @CheckPolicies(new ManagePolicyHandler())
  getCharge(@Param('id') id: string) {
    return this.omiseService.getCharge(id);
  }

  @Get('transaction')
  @CheckPolicies(new ManagePolicyHandler())
  getAllTransaction() {
    return this.omiseService.getAllTransaction();
  }

  @Get('transaction/:id')
  @CheckPolicies(new ManagePolicyHandler())
  getTransaction(@Param('id') id: string) {
    return this.omiseService.getTransaction(id);
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
