import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { RequestWithUserId } from 'src/common/types/auth';
import { AppAbility, RequestParams } from 'src/common/types/casl';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CaslAbilityFactory } from './casl-ability.factory';
import {
  PolicyHandler,
  UpdateProfilePolicyHandler,
  UpdateUserPolicyHandler,
} from './policyhandler';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        this.configService.get<string>('secret.poilcykey'),
        context.getHandler(),
      ) || [];
    const req: RequestWithUserId = context.switchToHttp().getRequest();
    const requestParams = this.filterRequestParams(req);
    const user: User = await this.userService.findOne(req.user.id);
    const ability = this.caslAbilityFactory.createForUser(user);

    return policyHandlers.every(handler =>
      this.execPolicyHandler(handler, ability, requestParams as RequestParams),
    );
  }

  private filterRequestParams(req: RequestWithUserId) {
    return {
      params: { ...req.params },
      query: { ...req.query },
    };
  }

  private setupHandler(handler: PolicyHandler, requestParams: RequestParams) {
    if (handler instanceof UpdateProfilePolicyHandler) {
      handler.setProfile(new Profile({ id: +requestParams.params.id }));
    }

    if (handler instanceof UpdateUserPolicyHandler) {
      handler.setUser(new User({ id: +requestParams.params.id }));
    }
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    requestParams?: RequestParams,
  ) {
    if (typeof handler === 'function') {
      return handler(ability);
    }

    this.setupHandler(handler, requestParams);

    return handler.handle(ability);
  }
}
