import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PromotionCode } from './promotion-code.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chargeId: string;

  @Column()
  transactionId: string;

  @Column()
  paymentMethod: string;

  @Column()
  amount: number;

  @Column()
  paid_at: Date;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToMany(() => Item, item => item.orders)
  @JoinTable()
  items: Item[];

  @OneToOne(() => PromotionCode, promotionCode => promotionCode.order, {
    persistence: false,
    cascade: true,
  })
  @JoinColumn()
  code: PromotionCode;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}
