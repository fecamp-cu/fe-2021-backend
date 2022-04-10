import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Project } from 'src/project/entities/project.entity';
import { ProjectService } from 'src/project/project.service';
import { UserModule } from 'src/user/user.module';
import { AboutFeContainerController } from './aboutFeContainer.controller';
import { AboutFeContainerService } from './aboutFeContainer.service';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { AboutFeContainer } from './entities/aboutFeContainer.entity';
import { Announcement } from './entities/announcement.entity';
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
      Project,
      Announcement,
    ]),
    UserModule,
  ],
  controllers: [
    SettingController,
    TimelineEventController,
    QualificationPreviewController,
    AboutFeContainerController,
    PhotoPreviewController,
    SponcerContainerController,
    AnnouncementController,
  ],
  providers: [
    SettingService,
    TimelineEventService,
    SponcerContainerService,
    PhotoPreviewService,
    AboutFeContainerService,
    QualificationPreviewService,
    CaslAbilityFactory,
    ProjectService,
    AnnouncementService,
  ],
})
export class SettingModule {}
