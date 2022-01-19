import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutFeContainerService } from './aboutFeContainer.service';
import { AboutFeContainer } from './entities/aboutFeContainer.entity';
import { PhotoPreview } from './entities/photoPreview.entity';
import { QualificationPreview } from './entities/qualificationPreview.entity';
import { Setting } from './entities/setting.entity';
import { SponcerContainer } from './entities/sponcerContainer.entity';
import { TimelineEvent } from './entities/timelineEvent.entity';
import { PhotoPreviewService } from './photoPreview.service';
import { QualificationPreviewService } from './qualificationPreview.service';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SponcerContainerService } from './sponcerContainer.service';
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
  controllers: [SettingController],
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
