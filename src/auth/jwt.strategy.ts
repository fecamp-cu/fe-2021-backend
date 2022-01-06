import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/common/types/auth';

const cookieExtractor = function (req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  if (token) {
    return token;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secret'),
    });
  }

  async validate(payload: TokenPayload) {
    return {
      id: payload.id,
    };
  }
}
