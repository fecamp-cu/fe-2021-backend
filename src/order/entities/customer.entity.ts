import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  email: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  tel: string;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'sub_district', nullable: true })
  subdistrict: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  postcode: string;

  @OneToMany(() => Order, order => order.customer, { persistence: false, cascade: true })
  orders: Order[];

  @OneToOne(() => User, user => user.customer)
  user: User;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  constructor(partial: Partial<Customer>) {
    Object.assign(this, partial);
  }
}
