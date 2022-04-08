import Faker from 'faker';
import { Token } from 'src/auth/entities/token.entity';
import { ServiceType } from 'src/common/enums/service-type';
import { define } from 'typeorm-seeding';

type TokenContext = {
  serviceType?: ServiceType;
  serviceUserId?: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresDate?: Date;
};

define(Token, (faker: typeof Faker, context: TokenContext) => {
  const serviceTypes = [ServiceType.FACEBOOK, ServiceType.FE_CAMP, ServiceType.GOOGLE];
  const serviceType = context?.serviceType
    ? context.serviceType
    : serviceTypes[faker.random.number({ min: 0, max: serviceTypes.length - 1 })];
  const serviceUserId = context?.serviceUserId ? context.serviceUserId : faker.lorem.text();
  const idToken = context?.idToken ? context.idToken : faker.lorem.text();
  const accessToken = context?.accessToken ? context.accessToken : faker.lorem.text();
  const refreshToken = context?.refreshToken ? context.refreshToken : faker.lorem.text();
  const expiresDate = context?.expiresDate ? context.expiresDate : faker.date.future();

  const token = new Token({
    serviceType,
    serviceUserId,
    idToken,
    accessToken,
    refreshToken,
    expiresDate,
  });
  return token;
});
