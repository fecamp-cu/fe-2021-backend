import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';

@ApiTags('Customer')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  async findAll(@Res() res) {
    const customer: Customer[] = await this.customerService.findAll();
    return res.status(HttpStatus.OK).json(customer);
  }

  @ApiOkResponse({ description: "Successfully get user's customer", type: [Customer] })
  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.customerService.findOne(+id);
  }

  @ApiOperation({ description: "Update user's customer (can only update your customer)" })
  @ApiOkResponse({ description: "Successfully updated user's customer", type: Customer })
  @Patch(':id')
  @CheckPolicies(new ManagePolicyHandler())
  update(@Param('id', ParseIntPipe) id: number, @Body() customer: Customer) {
    return this.customerService.update(+id, customer);
  }

  @ApiNoContentResponse({ description: "Successfully deleted user's customer" })
  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.remove(id);
  }
}
