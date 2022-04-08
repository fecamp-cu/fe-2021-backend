import * as bcrypt from 'bcrypt';
import Faker from 'faker';
import { Token } from 'src/auth/entities/token.entity';
import { Role } from 'src/common/enums/role';
import { User } from 'src/user/entities/user.entity';
import { define } from 'typeorm-seeding';

type UserContext = {
  username?: string;
  password?: string;
  email?: string;
  role: Role;
  tokens: Token[];
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
    tokens: context.tokens,
    isEmailVerified,
  });
  return user;
});
