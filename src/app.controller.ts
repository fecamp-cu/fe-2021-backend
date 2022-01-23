import { Controller, Get, Request } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('who-am-I')
  async whoAmI(@Request() req: any) {
    const user = req.user ? classToPlain(new User(req.user)) : undefined;

    return {
      user,
      csrfToken: req.csrfToken(),
    };
  }
}
