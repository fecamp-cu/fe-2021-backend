import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutFeContainerService } from './aboutFeContainer.service';
import { AboutFeContainer } from './entities/about_fe_container.entity';
import { PhotoPreview } from './entities/photo_preview.entity';
import { QualificationPreview } from './entities/qualification_preview.entity';
import { Setting } from './entities/setting.entity';
import { SponcerContainer } from './entities/sponcer_container.entity';
import { TimelineEvent } from './entities/timeline_event.entity';
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
