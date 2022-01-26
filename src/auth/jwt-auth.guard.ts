import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import * as moment from 'moment';
import { AuthService } from './auth.service';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService, private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isNeedAuth = this.reflector.get<boolean>('isNeedAuth', context.getHandler());
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic && !isNeedAuth) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const refreshToken: string = req.cookies['refresh_token'];
    const getRefreshToken: TokenDto = await this.authService.findRefreshToken(refreshToken);

    if (moment().add(3, 'm').isAfter(moment(getRefreshToken.expiresDate.getTime()))) {
      const newRefreshToken = await this.authService.createRefreshToken(getRefreshToken.user.id);
      const newToken = await this.authService.createToken(getRefreshToken.user);

      req.cookies['access_token'] = newToken;
      res.cookie('access_token', newToken, { httpOnly: true, secure: false });
      res.cookie('refresh_token', newRefreshToken, { httpOnly: true, secure: false });
    }

    const valid = await super.canActivate(context);

    if (!valid) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
