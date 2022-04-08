import Faker from 'faker';
import { ItemType } from 'src/common/enums/item-type';
import { Item } from 'src/item/entities/item.entity';
import { define } from 'typeorm-seeding';

type ItemContext = {
  type: ItemType;
  thumbnail: string;
  fileURL: string;
  price: number;
  quantityInStock: number;
  title: string;
  summary: string;
  author: string;
};

define(Item, (faker: typeof Faker, context: ItemContext) => {
  const types = [ItemType.EXAM_PREP, ItemType.OLD_PAPERS];
  const type = context?.type
    ? context.type
    : types[faker.random.number({ min: 0, max: types.length - 1 })];
  const thumbnail = context?.thumbnail ? context.thumbnail : faker.lorem.text();
  const fileURL = context?.fileURL ? context.fileURL : faker.lorem.text();
  const price = context?.price ? context.price : faker.random.number({ min: 2000, max: 100000 });
  const quantityInStock = context?.quantityInStock
    ? context.quantityInStock
    : faker.random.number({ min: 1, max: 100 });
  const title = context?.title ? context.title : faker.lorem.text();
  const summary = context?.summary ? context.summary : faker.lorem.sentence();
  const author = context?.author ? context.author : faker.name.firstName();

  const item = new Item({
    type,
    thumbnail,
    fileURL,
    price,
    quantityInStock,
    title,
    summary,
    author,
  });
  return item;
});
