import { ItemType } from 'src/common/enums/item-type';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemIndex } from './item-index.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: ItemType;

  @Column({ name: 'image_url' })
  thumbnail: string;

  @Column({ name: 'file_url' })
  fileURL: string;

  @Column({ type: 'smallint' })
  price: number;

  @Column()
  title: string;

  @Column()
  summary: string;

  @Column()
  author: string;

  @ManyToMany(() => User, user => user.items)
  users?: User[];

  @OneToMany(() => ItemIndex, index => index.item, { persistence: false, cascade: true })
  indexes: ItemIndex[];

  @OneToMany(() => OrderItem, order => order.item)
  orders?: OrderItem[];

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  constructor(partial: Partial<Item>) {
    Object.assign(this, partial);
  }
}
