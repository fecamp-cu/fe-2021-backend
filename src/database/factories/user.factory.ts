import * as bcrypt from 'bcrypt';
import Faker from 'faker';
import { Token } from 'src/auth/entities/token.entity';
import { Role } from 'src/common/enums/role';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import { define } from 'typeorm-seeding';

type UserContext = {
  username?: string;
  password?: string;
  email?: string;
  profile: Profile;
  role: Role;
  tokens?: Token[];
};

define(User, (faker: typeof Faker, context: UserContext) => {
  const username = context?.username ? context.username : faker.internet.userName();
  let password = context?.password ? context.password : faker.internet.password();
  password = bcrypt.hash(password, 10);
  const email = context?.email ? context.email : faker.internet.email();
  const isEmailVerified = faker.random.boolean();

  const user = new User({
    username,
    password,
    email,
    role: context.role,
    isEmailVerified,
    profile: context.profile,
  });

  user.tokens = context?.tokens ? context.tokens : [];

  return user;
});
