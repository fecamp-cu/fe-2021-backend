import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from 'src/common/enums/action';
import { Role } from 'src/common/enums/role';
import { AppAbility, Subjects } from 'src/common/types/casl';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build, cannot } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    cannot(Action.UPDATE, 'all').because('Not enough permissions');

    if (user.role === Role.ADMIN) {
      can(Action.MANAGE, 'all');
    }

    if (user.role === Role.USER) {
      can(
        Action.UPDATE,
        Profile,
        [
          'firstName',
          'lastName',
          'imageUrl',
          'address',
          'district',
          'subdistrict',
          'province',
          'postcode',
          'tel',
          'school',
          'grade',
        ],
        { id: user.id },
      );
      can(Action.UPDATE, User, ['username', 'password'], { id: user.id });
    }

    can(Action.READ, 'all');
    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
