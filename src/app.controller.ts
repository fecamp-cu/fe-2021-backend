import { Controller, Get, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { RequestWithUserId } from './common/types/auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private configService: ConfigService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('who-am-I')
  async whoAmI(@Request() req: RequestWithUserId) {
    if (this.configService.get<boolean>('app.devMode')) {
      return 'CSRF token is not available in dev mode';
    }

    return {
      csrfToken: req.csrfToken(),
    };
  }
}
