import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutFeContainer } from './entities/about_fe_container.entity';
import { PhotoPreview } from './entities/photo_preview.entity';
import { QualificationPreview } from './entities/qualification_preview.entity';
import { Setting } from './entities/setting.entity';
import { SponcerContainer } from './entities/sponcer_container.entity';
import { TimelineEvent } from './entities/timeline_event.entity';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';

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
  providers: [SettingService],
})
export class SettingModule {}
