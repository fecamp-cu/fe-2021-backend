import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestWithUserId } from './common/types/auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('who-am-I')
  async whoAmI(@Request() req: RequestWithUserId) {
    return {
      csrfToken: req.csrfToken(),
    };
  }
}
