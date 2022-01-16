import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class ItemIndex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint' })
  order: number;

  @Column()
  text: string;

  @ManyToOne(() => Item, item => item.indexes)
  item: Item;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  constructor(partial: Partial<ItemIndex>) {
    Object.assign(this, partial);
  }
}
