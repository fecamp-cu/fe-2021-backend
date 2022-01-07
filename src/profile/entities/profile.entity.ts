import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column()
  tel: string;

  @Column()
  grade: string;

  @Column()
  school: string;

  @Column()
  address: string;

  @Column({ name: 'sub_district' })
  subdistrict: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @Column()
  postcode: string;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;
}
