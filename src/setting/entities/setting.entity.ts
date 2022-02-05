import { IsBoolean, IsUrl } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AboutFeContainer } from './aboutFeContainer.entity';
import { PhotoPreview } from './photoPreview.entity';
import { QualificationPreview } from './qualificationPreview.entity';
import { SponcerContainer } from './sponcerContainer.entity';
import { TimelineEvent } from './timelineEvent.entity';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'youtube_url' })
  @IsUrl()
  youtubeUrl: string;

  @Column({ name: 'register_form_url' })
  @IsUrl()
  registerFormUrl: string;

  @Column({ name: 'is_active' })
  @IsBoolean()
  isActive: boolean;

  @OneToMany(() => TimelineEvent, timelineEvent => timelineEvent.setting)
  timelineEvents: TimelineEvent[];

  @OneToMany(() => SponcerContainer, sponcerContainer => sponcerContainer.setting)
  sponcerContainers: SponcerContainer[];

  @OneToMany(() => QualificationPreview, qualificationPreview => qualificationPreview.setting)
  qualificationPreviews: QualificationPreview[];

  @OneToMany(() => PhotoPreview, photoPreview => photoPreview.setting)
  photoPreviews: PhotoPreview[];

  @OneToMany(() => AboutFeContainer, aboutFeContainer => aboutFeContainer.setting)
  aboutFeContainers: AboutFeContainer[];

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;
}
