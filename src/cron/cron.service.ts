import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ThirdPartyAuthService } from 'src/auth/third-party-auth.service';
import { ServiceType } from 'src/common/enums/service-type';

@Injectable()
export class CronService {
  constructor(private readonly thirdPartyAuthService: ThirdPartyAuthService) {}

  private readonly logger = new Logger('CronService');

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async redeemNewToken() {
    const tokenDto = await this.thirdPartyAuthService.getAdminToken(ServiceType.GOOGLE);
    await this.thirdPartyAuthService.validateAndRefreshServiceToken(tokenDto);
    this.logger.log('Successfully Redeem New Admin Token');
  }
}
