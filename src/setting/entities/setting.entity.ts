import { IsBoolean, IsUrl } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AboutFeContainer } from './aboutFeContainer.entity';
import { Announcement } from './announcement.entity';
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

  @Column({ name: 'publish_date' })
  publishDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

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

  @OneToMany(() => Announcement, announcement => announcement.setting)
  announcements: Announcement[];

  @ManyToOne(() => User, user => user.settings)
  user: User;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;
}
