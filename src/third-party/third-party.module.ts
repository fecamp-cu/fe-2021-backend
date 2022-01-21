import { Module } from '@nestjs/common';
import { DiscordService } from './discord/discord.service';
import { FacebookAuthentication } from './facebook/facebook-auth.service';
import { GoogleAuthentication } from './google-cloud/google-auth.service';
import { GoogleGmail } from './google-cloud/google-gmail.service';
import { GoogleCloudStorage } from './google-cloud/google-storage.service';
import { OmiseService } from './omise/omise.service';

@Module({
  providers: [
    GoogleAuthentication,
    GoogleCloudStorage,
    GoogleGmail,
    FacebookAuthentication,
    OmiseService,
    DiscordService,
  ],
  exports: [
    GoogleAuthentication,
    GoogleCloudStorage,
    GoogleGmail,
    FacebookAuthentication,
    OmiseService,
    DiscordService,
  ],
})
export class ThirdPartyModule {}
