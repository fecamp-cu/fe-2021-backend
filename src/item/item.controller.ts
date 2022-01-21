import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ItemDto } from './dto/item.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() itemDto: ItemDto) {
    return this.itemService.create(itemDto);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() itemDto: ItemDto) {
    return this.itemService.update(+id, itemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
