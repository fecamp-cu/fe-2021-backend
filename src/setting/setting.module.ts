import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutFeContainerController } from './aboutFeContainer.controller';
import { AboutFeContainerService } from './aboutFeContainer.service';
import { AboutFeContainer } from './entities/aboutFeContainer.entity';
import { PhotoPreview } from './entities/photoPreview.entity';
import { QualificationPreview } from './entities/qualificationPreview.entity';
import { Setting } from './entities/setting.entity';
import { SponcerContainer } from './entities/sponcerContainer.entity';
import { TimelineEvent } from './entities/timelineEvent.entity';
import { PhotoPreviewController } from './photoPreview.controller';
import { PhotoPreviewService } from './photoPreview.service';
import { QualificationPreviewController } from './qualificationPreview.controller';
import { QualificationPreviewService } from './qualificationPreview.service';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SponcerContainerController } from './sponcerContainer.controller';
import { SponcerContainerService } from './sponcerContainer.service';
import { TimelineEventController } from './timelineEvent.controller';
import { TimelineEventService } from './timelineEvent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Setting,
      TimelineEvent,
      SponcerContainer,
      QualificationPreview,
      PhotoPreview,
      AboutFeContainer,
    ]),
  ],
  controllers: [
    SettingController,
    TimelineEventController,
    QualificationPreviewController,
    AboutFeContainerController,
    PhotoPreviewController,
    SponcerContainerController,
  ],
  providers: [
    SettingService,
    TimelineEventService,
    SponcerContainerService,
    PhotoPreviewService,
    AboutFeContainerService,
    QualificationPreviewService,
  ],
})
export class SettingModule {}
