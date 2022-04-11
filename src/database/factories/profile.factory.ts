import Faker from 'faker';
import { Grade } from 'src/common/enums/profile';
import { Profile } from 'src/profile/entities/profile.entity';
import { define } from 'typeorm-seeding';

type ProfileContext = {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  tel?: string;
  grade?: Grade;
  school?: string;
  address?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  postcode?: string;
};

define(Profile, (faker: typeof Faker, context: ProfileContext) => {
  const firstName = context?.firstName ? context.firstName : faker.name.firstName();
  const lastName = context?.lastName ? context.lastName : faker.name.lastName();
  const imageUrl = context?.imageUrl ? context.imageUrl : faker.internet.avatar();
  const tel = context?.tel ? context.tel : faker.phone.phoneNumber();
  const grades = [Grade.M4, Grade.M5, Grade.M6, Grade.VC1, Grade.VC2, Grade.VC3, Grade.OTHER];
  const grade = context?.grade
    ? context.grade
    : grades[faker.random.number({ min: 0, max: grades.length - 1 })];
  const school = context?.school ? context.school : faker.lorem.text();
  const address = context?.address ? context.address : faker.address.streetAddress();
  const subdistrict = context?.subdistrict ? context.subdistrict : faker.address.streetName();
  const district = context?.district ? context.district : faker.address.city();
  const province = context?.province ? context.province : faker.address.state();
  const postcode = context?.postcode ? context.postcode : faker.address.zipCode();

  const profile = new Profile({
    firstName,
    lastName,
    imageUrl,
    tel,
    grade,
    school,
    address,
    subdistrict,
    district,
    province,
    postcode,
  });

  return profile;
});
