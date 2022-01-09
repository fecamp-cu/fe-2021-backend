import { SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Action } from 'src/common/enums/action';
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
export class UpdatePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, 'all');
  }
}

export class DeletePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.DELETE, 'all');
  }
}
