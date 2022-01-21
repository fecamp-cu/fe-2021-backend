import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemDto } from './dto/item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(@InjectRepository(Item) private itemRepository: Repository<Item>) {}

  create(itemDto: ItemDto) {
    return 'This action adds a new item';
  }

  async findAll(relations: string[] = ['indexes']): Promise<ItemDto[]> {
    const items = await this.itemRepository.find({ relations });
    return items.map(item => this.rawToDTO(item));
  }

  async findOne(id: number, relations: string[] = ['indexes']): Promise<ItemDto> {
    const item = await this.itemRepository.findOne(id, { relations });

    if (!item) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found item',
      });
    }

    return item;
  }

  async findMulti(ids: number[], relations: string[] = ['indexes']): Promise<ItemDto[]> {
    const items = await this.itemRepository.findByIds(ids, { relations });
    return items.map(item => this.rawToDTO(item));
  }

  update(id: number, itemDto: ItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }

  public rawToDTO(item: Item): ItemDto {
    const itemDto = new ItemDto({
      id: item.id,
      type: item.type,
      thumbnail: item.thumbnail,
      fileURL: item.fileURL,
      title: item.title,
      summary: item.summary,
      price: item.price,
      author: item.author,
    });

    if (item.users) {
      itemDto.users = item.users;
    }

    if (item.indexes) {
      itemDto.indexes = item.indexes;
    }

    if (item.orders) {
      itemDto.orders = item.orders;
    }

    return itemDto;
  }
}
