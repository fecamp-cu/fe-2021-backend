import { PaymentStatus } from 'src/common/enums/shop';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderItem } from './order-item.entity';
import { PromotionCode } from './promotion-code.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'source_id', nullable: true, select: false })
  sourceId: string;

  @Index()
  @Column({ name: 'charge_id', nullable: true, select: false })
  chargeId: string;

  @Column({ name: 'transaction_id', nullable: true, select: false })
  transactionId: string;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column()
  amount: number;

  @Column({ name: 'paid_at', nullable: true })
  paidAt: Date;

  @ManyToOne(() => Customer, cumtomer => cumtomer.orders)
  customer: Customer;

  @OneToMany(() => OrderItem, item => item.order)
  @JoinTable()
  items: OrderItem[];

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
