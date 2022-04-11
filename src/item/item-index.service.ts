import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemIndexDto } from './dto/item-index.dto';
import { ItemIndex } from './entities/item-index.entity';

@Injectable()
export class ItemIndexService {
  constructor(@InjectRepository(ItemIndex) private itemIndexRepository: Repository<ItemIndex>) {}

  async create(itemIndexDto: ItemIndexDto): Promise<ItemIndexDto> {
    const index: ItemIndex = this.itemIndexRepository.create(itemIndexDto);
    const createdIndex: ItemIndex = await this.itemIndexRepository.save(index);
    return this.rawToDTO(createdIndex);
  }

  async findAll(): Promise<ItemIndexDto[]> {
    const indexes = await this.itemIndexRepository.find();
    return indexes;
  }

  async findOne(id: number): Promise<ItemIndexDto> {
    const item = await this.itemIndexRepository.findOne(id);

    if (!item) {
      throw new NotFoundException({
        StatusCode: 404,
        reason: 'NOT_FOUND',
        message: 'Not found item',
      });
    }

    return item;
  }

  async update(id: number, itemItemDto: ItemIndexDto): Promise<ItemIndexDto> {
    const itemIndex: ItemIndexDto = await this.findOne(id);
    await this.itemIndexRepository.update(id, itemItemDto);

    return itemIndex;
  }

  async remove(id: number) {
    const itemIndex: ItemIndexDto = await this.findOne(id);
    await this.itemIndexRepository.softDelete(id);

    return itemIndex;
  }

  public rawToDTO(itemIndex: ItemIndex) {
    const result = new ItemIndexDto({
      id: itemIndex.id,
      order: itemIndex.order,
      text: itemIndex.text,
    });

    return result;
  }
}
