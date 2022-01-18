import { Module } from '@nestjs/common';
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
  ],
  exports: [
    GoogleAuthentication,
    GoogleCloudStorage,
    GoogleGmail,
    FacebookAuthentication,
    OmiseService,
  ],
})
export class ThirdPartyModule {}
