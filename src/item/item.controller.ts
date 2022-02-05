import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { ItemIndexDto } from './dto/item-index.dto';
import { ItemDto } from './dto/item.dto';
import { ItemIndexService } from './item-index.service';
import { ItemService } from './item.service';

@ApiTags('Item')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly itemIndexService: ItemIndexService,
  ) {}

  @CheckPolicies(new ManagePolicyHandler())
  @Post()
  create(@Body() itemDto: ItemDto) {
    return this.itemService.create(itemDto);
  }

  @Get()
  @Public()
  findAll(@Query('index') withIndex: boolean = false) {
    let relations: string[] = [];
    if (withIndex) {
      relations = ['indexes'];
    }
    return this.itemService.findAll(relations);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.findOne(id);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() itemDto: ItemDto) {
    return this.itemService.update(id, itemDto);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.remove(id);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Post(':id/index')
  createindex(@Param('id', ParseIntPipe) id: number, @Body() itemIndexDto: ItemIndexDto) {
    itemIndexDto.item = new ItemDto({ id });
    return this.itemIndexService.create(itemIndexDto);
  }

  @Get('index')
  findAllIndex() {
    return this.itemIndexService.findAll();
  }

  @Get('index/:id')
  findOneIndex(@Param('id', ParseIntPipe) id: number) {
    return this.itemIndexService.findOne(id);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Patch('index/:id')
  updateIndex(@Param('id', ParseIntPipe) id: number, @Body() itemIndexDto: ItemIndexDto) {
    return this.itemIndexService.update(id, itemIndexDto);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Delete('index/:id')
  removeIndex(@Param('id', ParseIntPipe) id: number) {
    return this.itemIndexService.remove(id);
  }
}
