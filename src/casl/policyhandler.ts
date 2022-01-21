import { SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Action } from 'src/common/enums/action';
import { User } from 'src/user/entities/user.entity';
import { AppAbility } from './casl-ability.factory';

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
  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, User);
  }
}

export class DeletePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.DELETE, 'all');
  }
}
