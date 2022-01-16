import { ItemType } from 'src/common/enums/item-type';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @ManyToOne(() => User, user => user.items)
  user: User;

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
