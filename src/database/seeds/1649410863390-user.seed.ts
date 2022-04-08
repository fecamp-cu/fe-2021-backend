import * as faker from 'faker';
import { Token } from 'src/auth/entities/token.entity';
import { User } from 'src/user/entities/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class UserSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    connection.isConnected;
    for (let i = 0; i < 20; i++) {
      const tokens = await factory(Token)().createMany(faker.datatype.number({ min: 1, max: 3 }));
      const role = ['user', 'admin'];
      await factory(User)({
        role: role[faker.datatype.number({ min: 1, max: 2 })],
        tokens,
      }).create();
    }
  }
}
