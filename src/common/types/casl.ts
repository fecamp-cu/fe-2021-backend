import { Ability, InferSubjects } from '@casl/ability';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import { Action } from '../enums/action';

export type Subjects = InferSubjects<typeof User | User | Profile | typeof Profile> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

export type RequestParams = {
  params: {
    id: string;
  };
  query: {
    code?: string;
  };
};
