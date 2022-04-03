import { Setting } from 'src/setting/entities/setting.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contact } from './contact.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'publish_date' })
  publishDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  @OneToMany(() => Contact, contact => contact.project, { cascade: true })
  contacts: Contact[];

  @OneToOne(() => Setting, { persistence: false, cascade: true })
  @JoinColumn()
  setting: Setting;

  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
}
