import { Injectable } from '@nestjs/common';
import { ItemIndexDto } from './dto/item-index.dto';
import { ItemIndex } from './entities/item-index.entity';

@Injectable()
export class ItemIndexService {
  public rawToDTO(itemIndex: ItemIndex) {
    return new ItemIndexDto({
      id: itemIndex.id,
      order: itemIndex.order,
      text: itemIndex.text,
      item: itemIndex.item,
    });
  }
}
