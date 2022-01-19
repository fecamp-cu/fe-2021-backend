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
export class SponcerContainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column({ name: 'img_url' })
  imgUrl: string;

  @ManyToOne(() => Setting, setting => setting.sponcerContainers)
  setting: Setting;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;
}
