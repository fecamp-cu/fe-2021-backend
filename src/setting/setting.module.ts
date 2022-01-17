import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutFeContainerService } from './about_fe_container.service';
import { AboutFeContainer } from './entities/about_fe_container.entity';
import { PhotoPreview } from './entities/photo_preview.entity';
import { QualificationPreview } from './entities/qualification_preview.entity';
import { Setting } from './entities/setting.entity';
import { SponcerContainer } from './entities/sponcer_container.entity';
import { TimelineEvent } from './entities/timeline_event.entity';
import { PhotoPreviewService } from './photo_preview.service';
import { QualificationPreviewService } from './qualification_preview.service';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SponcerContainerService } from './sponcer_container.service';
import { TimelineEventService } from './timeline_event.service';

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
