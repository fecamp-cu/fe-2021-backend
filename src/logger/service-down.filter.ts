import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { errorMessage } from 'src/common/constants/discord-message.constant';
import { Discord } from 'src/common/enums/third-party';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { GoogleException } from 'src/common/exceptions/google.exception';
import { OmiseException } from 'src/common/exceptions/omise.exception';
import { TypeORMException } from 'src/common/exceptions/typeorm.exception';
import { DiscordService } from 'src/third-party/discord/discord.service';
import { GoogleCloudStorage } from 'src/third-party/google-cloud/google-storage.service';

@Catch(CustomException, GoogleException, OmiseException, TypeORMException)
export class ServiceDownFilter implements ExceptionFilter {
  private discordService: DiscordService;
  private logStorage: GoogleCloudStorage;

  constructor(private configService: ConfigService) {
    this.discordService = new DiscordService(configService);
    this.logStorage = new GoogleCloudStorage(configService);
  }

  async catch(exception: CustomException, host: ArgumentsHost) {
    const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const buffer = Buffer.from(exception.stack, 'utf-8');
    const fileUrl = await this.logStorage.uploadFile('error-log.txt', buffer);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const embed = this.discordService.createEmbed(
        'Caution!!\n' + exception.name,
        errorMessage(exception.name, exception.message, request.url, status, fileUrl),
        Discord.ALERT_COLOR,
      );

      if (exception instanceof OmiseException) {
        embed.author = this.discordService.createAuthor(
          Discord.OMISE_USERNAME,
          Discord.OMISE_AVATAR,
          Discord.OMISE_URL,
        );
      }

      this.discordService.sendMessage(
        Discord.ALERT_USERNAME,
        Discord.ALERT_AVATAR_URL,
        Discord.TAG_ADMIN,
        embed,
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
