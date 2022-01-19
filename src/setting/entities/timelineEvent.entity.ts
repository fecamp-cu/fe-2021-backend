import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Setting } from './setting.entity';

@Entity()
export class TimelineEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ name: 'event_date' })
  eventDate: Date;

  @ManyToOne(() => Setting, setting => setting.timelineEvents)
  setting: Setting;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;
}
