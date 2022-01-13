import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AboutFeContainer } from './about_fe_container.entity';
import { PhotoPreview } from './photo_preview.entity';
import { QualificationPreview } from './qualification_preview.entity';
import { SponcerContainer } from './sponcer_container.entity';
import { TimelineEvent } from './timeline_event.entity';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  youtube_url: string;

  @Column()
  register_form_url: string;

  @Column()
  is_active: boolean;

  @OneToMany(() => TimelineEvent, timeline_event => timeline_event.setting)
  timeline_events: TimelineEvent[];
  @OneToMany(() => SponcerContainer, sponcer_container => sponcer_container.setting)
  sponcer_containers: SponcerContainer[];
  @OneToMany(() => QualificationPreview, qualification_preview => qualification_preview.setting)
  qualification_previews: QualificationPreview[];
  @OneToMany(() => QualificationPreview, photo_preview => photo_preview.setting)
  photo_previews: PhotoPreview[];
  @OneToMany(() => AboutFeContainer, about_fe_container => about_fe_container.setting)
  about_fe_containers: AboutFeContainer[];

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;
}
