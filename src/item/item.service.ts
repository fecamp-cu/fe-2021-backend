import { Injectable } from '@nestjs/common';
import { ItemDto } from './dto/item.dto';

@Injectable()
export class ItemService {
  create(itemDto: ItemDto) {
    return 'This action adds a new item';
  }

  findAll() {
    return `This action returns all item`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, itemDto: ItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
