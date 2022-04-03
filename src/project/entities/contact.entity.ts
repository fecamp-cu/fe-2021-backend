import { ContactType } from 'src/common/enums/contact-type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  tel: string;

  @Column({ name: 'contact_type' })
  contactType: ContactType;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  @ManyToOne(() => Project, project => project.contacts)
  project: Project;

  // @ManyToOne(() => Setting, setting => setting.aboutFeContainers)
  // setting: Setting;
}
