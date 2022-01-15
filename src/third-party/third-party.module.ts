import { Module } from '@nestjs/common';
import { FacebookAuthentication } from './facebook/facebook-auth.service';
import { GoogleAuthentication } from './google-cloud/google-auth.service';
import { GoogleGmail } from './google-cloud/google-gmail.service';
import { GoogleCloudStorage } from './google-cloud/google-storage.service';

@Module({
  providers: [GoogleAuthentication, GoogleCloudStorage, GoogleGmail, FacebookAuthentication],
  exports: [GoogleAuthentication, GoogleCloudStorage, GoogleGmail, FacebookAuthentication],
})
export class ThirdPartyModule {}