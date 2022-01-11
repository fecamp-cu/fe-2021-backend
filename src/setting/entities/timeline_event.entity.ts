import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Setting } from './setting.entity';

@Entity()
export class Timeline_Event {
  @PrimaryColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  event_date: Date;

  @ManyToOne(() => Setting, setting => setting.timeline_events) setting: Setting;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;
}
