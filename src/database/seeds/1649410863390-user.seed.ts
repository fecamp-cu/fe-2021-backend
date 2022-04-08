import * as faker from 'faker';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class UserSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    connection.isConnected;
    for (let i = 0; i < 20; i++) {
      const profile = await factory(Profile)().create();
      const role = ['user', 'admin'];
      await factory(User)({
        password: 'adminadmin',
        role: role[faker.datatype.number({ min: 1, max: 2 })],
        profile,
      }).create();
    }
  }
}
