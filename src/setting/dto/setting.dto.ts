import { ApiProperty } from '@nestjs/swagger';
import { Youtube } from 'src/common/interface/youtube';
import { AboutFeContainerDto } from './aboutFeContainer.dto';
import { AnnouncementDto } from './announcement.dto';
import { PhotoPreviewDto } from './photoPreview.dto';
import { QualificationPreviewDto } from './qualificationPreview.dto';
import { SponcerContainerDto } from './sponcerContainer.dto';
import { TimelineEventDto } from './timelineEvent.dto';

export class SettingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  coverImgUrl: string;

  @ApiProperty()
  youtube: Youtube;

  @ApiProperty({ example: 'Register' })
  buttonText: string;

  @ApiProperty({ example: 'google.com' })
  registerFormUrl: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  publishDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  timelineEvents?: TimelineEventDto[];

  @ApiProperty()
  sponcerContainers?: SponcerContainerDto[];

  @ApiProperty()
  qualificationPreviews?: QualificationPreviewDto[];

  @ApiProperty()
  photoPreviews?: PhotoPreviewDto[];

  @ApiProperty()
  aboutFeContainers?: AboutFeContainerDto[];

  @ApiProperty()
  announcements?: AnnouncementDto[];

  constructor(partial: Partial<SettingDto>) {
    Object.assign(this, partial);
  }
}
