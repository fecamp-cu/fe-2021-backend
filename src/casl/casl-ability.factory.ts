import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from 'src/common/enums/action';
import { Role } from 'src/common/enums/role';
import { User } from 'src/user/entities/user.entity';

type Subjects = InferSubjects<typeof User | User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build, cannot } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    cannot(Action.UPDATE, 'all');
    if (user.role === Role.ADMIN) {
      can(Action.MANAGE, 'all'); // read-write access to everything
    }
    if (user.role === Role.USER) {
      can(Action.UPDATE, User, { id: user.id });
    }

    can(Action.READ, 'all'); // read-only access to everything
    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
