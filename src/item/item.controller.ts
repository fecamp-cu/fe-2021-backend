import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { ItemDto } from './dto/item.dto';
import { ItemService } from './item.service';

@ApiTags('Item')
@ApiHeaders([{ name: 'XSRF-TOKEN', required: true, description: 'CSRF Token' }])
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @CheckPolicies(new ManagePolicyHandler())
  @Post()
  create(@Body() itemDto: ItemDto) {
    return this.itemService.create(itemDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Patch(':id')
  update(@Param('id') id: string, @Body() itemDto: ItemDto) {
    return this.itemService.update(+id, itemDto);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
