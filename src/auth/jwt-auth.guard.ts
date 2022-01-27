import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ServiceType } from 'src/common/enums/service-type';
import { RequestWithUserId } from 'src/common/types/auth';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isNeedAuth = this.reflector.get<boolean>('isNeedAuth', context.getHandler());
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic && !isNeedAuth) {
      return true;
    }

    const valid = await super.canActivate(context);

    if (!valid) {
      throw new UnauthorizedException();
    }

    const req: RequestWithUserId = context.switchToHttp().getRequest();

    const user: UserDto = await this.userService.findOne(req.user.id, ['tokens']);
    const token = user.tokens.find(token => token.serviceType === ServiceType.FE_CAMP);

    if (token.accessToken !== req.headers['authorization'].split(' ')[1]) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
