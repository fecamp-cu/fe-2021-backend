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
export class QualificationPreview {
  @PrimaryColumn()
  id: number;

  @Column()
  order: number;

  @Column()
  text: string;

  @ManyToOne(() => Setting, setting => setting.qualification_previews) setting: Setting;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;
}
