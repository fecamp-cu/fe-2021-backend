import { Controller, Get, Request } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { AppService } from './app.service';
import { RequestWithUserId } from './common/types/auth';
import { User } from './user/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('who-am-I')
  async whoAmI(@Request() req: RequestWithUserId) {
    const user = req.user ? instanceToPlain(new User(req.user)) : undefined;

    return {
      user,
      csrfToken: req.csrfToken(),
    };
  }
}
