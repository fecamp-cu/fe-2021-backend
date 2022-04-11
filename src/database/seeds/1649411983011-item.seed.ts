import * as faker from 'faker';
import { ItemIndex } from 'src/item/entities/item-index.entity';
import { Item } from 'src/item/entities/item.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class ItemSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    connection.isConnected;
    for (let i = 0; i < 20; i++) {
      const item = await factory(Item)().create();
      for (let j = 0; j < faker.datatype.number({ min: 1, max: 10 }); j++) {
        await factory(ItemIndex)({ order: j + 1, item }).create();
      }
    }
  }
}
