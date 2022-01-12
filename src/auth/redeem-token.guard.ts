import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class RedeemTokenHandler implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const refreshToken: string = req.cookies['refresh_token'];
    const getRefreshToken: TokenDto = await this.authService.findRefreshToken(refreshToken);

    if (Date.now() + 60 * 5000 > getRefreshToken.expiresDate.getTime()) {
      const newRefreshToken = await this.authService.createRefreshToken(getRefreshToken.user.id);
      const newToken = await this.authService.createToken(getRefreshToken.user);

      req.cookies['access_token'] = newToken;
      res.cookie('access_token', newToken, { httpOnly: true, secure: false });
      res.cookie('refresh_token', newRefreshToken, { httpOnly: true, secure: false });
    }
    return true;
  }
}
