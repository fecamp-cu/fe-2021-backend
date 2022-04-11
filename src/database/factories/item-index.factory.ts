import Faker from 'faker';
import { ItemIndex } from 'src/item/entities/item-index.entity';
import { Item } from 'src/item/entities/item.entity';
import { define } from 'typeorm-seeding';

type IndexContext = {
  order: number;
  text?: string;
  item: Item;
};

define(ItemIndex, (faker: typeof Faker, context: IndexContext) => {
  const text = context?.text ? context.text : faker.lorem.text();

  const index = new ItemIndex({
    order: context.order,
    text: text,
    item: context.item,
  });
  return index;
});
