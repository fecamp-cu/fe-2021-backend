import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileType } from 'src/common/enums/third-party';
import { GoogleCloudStorage } from 'src/third-party/google-cloud/google-storage.service';
import { Repository } from 'typeorm';
import { ItemDto } from './dto/item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    private googleStorage: GoogleCloudStorage,
  ) {}

  async create(itemDto: ItemDto): Promise<ItemDto> {
    const item: Item = this.itemRepository.create(itemDto);
    const createdItem: Item = await this.itemRepository.save(item);
    return this.rawToDTO(createdItem);
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

  async update(id: number, itemDto: ItemDto, relations: string[] = []): Promise<ItemDto> {
    const item: ItemDto = await this.findOne(id, relations);
    await this.itemRepository.update(id, itemDto);

    return item;
  }

  async remove(id: number) {
    const item: ItemDto = await this.findOne(id);
    await this.itemRepository.softDelete(id);

    return item;
  }

  async uploadThumbnail(item: ItemDto, img: Buffer): Promise<ItemDto> {
    const imgName = this.googleStorage.getImageFileName(item.title, FileType.ITEM_THUMBNAIL);
    const imageURL = await this.googleStorage.uploadImage(imgName, img);

    item.thumbnail = imageURL;
    this.itemRepository.save(item);
    return item;
  }

  async uploadFile(item: ItemDto, filename: string, file: Buffer): Promise<ItemDto> {
    const fileUrl = await this.googleStorage.uploadFile(filename, file);

    item.fileURL = fileUrl;
    this.itemRepository.save(item);
    return item;
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
