import { PaymentStatus } from 'src/common/enums/shop';
import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
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

  @Index()
  @Column({ name: 'customer_email' })
  email: string;

  @Index()
  @Column({ name: 'source_id', nullable: true })
  sourceId: string;

  @Column({ name: 'charge_id', nullable: true })
  chargeId: string;

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column()
  amount: number;

  @Column({ name: 'paid_at', nullable: true })
  paidAt: Date;

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
  code?: PromotionCode;

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
