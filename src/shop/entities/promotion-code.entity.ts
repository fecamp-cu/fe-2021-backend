import { PromotionCodeType } from 'src/common/enums/promotion-code';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class PromotionCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: PromotionCodeType;

  @Column()
  code?: string;

  @Column()
  value?: number;

  @Column({ name: 'is_reuseable', default: false })
  isReuseable: boolean;

  @Column({ name: 'is_actived', default: false })
  isActived: boolean;

  @Column({ name: 'start_date', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ name: 'expires_date', nullable: true })
  expiresDate: Date;

  @OneToOne(() => Order, order => order.code)
  order: Order;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  constructor(partial: Partial<PromotionCode>) {
    Object.assign(this, partial);
  }
}
