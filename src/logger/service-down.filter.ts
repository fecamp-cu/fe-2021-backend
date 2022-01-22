import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Discord } from 'src/common/enums/third-party';
import { DiscordService } from 'src/third-party/discord/discord.service';

@Catch(HttpException)
export class ServiceDownFilter implements ExceptionFilter {
  private discordService: DiscordService;
  constructor(private configService: ConfigService) {
    this.discordService = new DiscordService(configService);
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const topic = 'Caution!!\n' + exception.message;
      const body = JSON.stringify(exception.getResponse());

      this.discordService.sendMessage(
        Discord.ALERT_USERNAME,
        Discord.ALERT_AVATAR_URL,
        topic,
        body,
        Discord.ALERT_COLOR,
      );
    }
  }
}
