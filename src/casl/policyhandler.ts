import { SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Action } from 'src/common/enums/action';
import { AppAbility } from 'src/common/types/casl';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

const configService: ConfigService = new ConfigService();

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(configService.get<string>('policyguard'), handlers);

export class ManagePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.MANAGE, 'all');
  }
}
export class ReadPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.READ, 'all');
  }
}
export class CreatePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.CREATE, 'all');
  }
}
export class UpdateUserPolicyHandler implements IPolicyHandler {
  private user;
  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, this.user);
  }

  setUser(user: User) {
    this.user = user;
  }
}

export class UpdateProfilePolicyHandler implements IPolicyHandler {
  private profile: Profile;
  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, this.profile);
  }

  setProfile(profile: Profile) {
    this.profile = profile;
  }
}

export class DeletePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.DELETE, 'all');
  }
}
