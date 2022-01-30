import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Discord } from 'src/common/enums/third-party';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { GoogleException } from 'src/common/exceptions/google.exception';
import { OmiseException } from 'src/common/exceptions/omise.exception';
import { TypeORMException } from 'src/common/exceptions/typeorm.exception';
import { DiscordService } from 'src/third-party/discord/discord.service';

@Catch(CustomException, GoogleException, OmiseException, TypeORMException)
export class ServiceDownFilter implements ExceptionFilter {
  private discordService: DiscordService;
  constructor(private configService: ConfigService) {
    this.discordService = new DiscordService(configService);
  }

  catch(exception: CustomException, host: ArgumentsHost) {
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const topic = 'Caution!!\n' + exception.name;
      const body = JSON.stringify({
        name: exception.name,
        error: exception.message,
        path: request.url,
        time: new Date().toUTCString(),
      });

      this.discordService.sendMessage(
        Discord.ALERT_USERNAME,
        Discord.ALERT_AVATAR_URL,
        topic,
        body,
        Discord.ALERT_COLOR,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      name: exception.name,
      error: exception.message,
    });
  }
}
