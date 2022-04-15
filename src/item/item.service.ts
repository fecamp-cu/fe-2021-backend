import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FileType } from 'src/common/enums/third-party';
import { GoogleCloudStorage } from 'src/third-party/google-cloud/google-storage.service';
import { Repository } from 'typeorm';
import { ItemDto } from './dto/item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    private googleStorage: GoogleCloudStorage,
  ) {}

  async create(itemDto: ItemDto): Promise<ItemDto> {
    const createdItem = await this.itemRepository.save(itemDto);
    return this.rawToDTO(createdItem);
  }

  async findWithPaginate(
    options: IPaginationOptions,
    relations: string[],
  ): Promise<Pagination<ItemDto>> {
    const query = this.itemRepository.createQueryBuilder('item');
    if (relations.length > 0) {
      query.leftJoinAndSelect('item.indexes', 'index');
    }
    return paginate<Item>(query, options);
  }

  async findAll(relations: string[]): Promise<ItemDto[]> {
    const items = await this.itemRepository.find({ relations });
    return items.map(item => this.rawToDTO(item));
  }

  async findOne(id: number): Promise<ItemDto> {
    const item = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.indexes', 'index')
      .where('item.id = :id', { id })
      .orderBy('index.order', 'ASC')
      .getOne();

    if (!item) {
      throw new NotFoundException({
        StatusCode: 404,
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

  async update(id: number, itemDto: UpdateItemDto): Promise<ItemDto> {
    const item = await this.findOne(id);

    item.title = itemDto.title ? itemDto.title : item.title;
    item.summary = itemDto.summary ? itemDto.summary : item.summary;
    item.price = itemDto.price ? itemDto.price : item.price;
    item.quantityInStock = itemDto.quantityInStock ? itemDto.quantityInStock : item.quantityInStock;
    item.author = itemDto.author ? itemDto.author : item.author;
    item.type = itemDto.type ? itemDto.type : item.type;
    item.thumbnail = itemDto.thumbnail !== undefined ? itemDto.thumbnail : item.thumbnail;
    item.fileURL = itemDto.fileURL !== undefined ? itemDto.fileURL : item.fileURL;
    item.indexes = itemDto.indexes ? itemDto.indexes : item.indexes;

    console.log(item);

    await this.itemRepository.save(item);

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
