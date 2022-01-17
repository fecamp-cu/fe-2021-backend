import { Token } from 'src/auth/entities/token.entity';
import { ValidateCode } from 'src/auth/entities/validate-code.entity';
import { Role } from 'src/common/enums/role';
import { Item } from 'src/item/entities/item.entity';
import { Order } from 'src/order/entities/order.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @OneToMany(() => Token, token => token.user, { persistence: false, cascade: true })
  tokens: Token[];

  @OneToMany(() => ValidateCode, validateCode => validateCode.user, {
    persistence: false,
    cascade: true,
  })
  verifiedCodes: ValidateCode[];

  @OneToMany(() => Item, item => item.user, { persistence: false, cascade: true })
  items: Item[];

  @OneToMany(() => Order, order => order.user, { persistence: false, cascade: true })
  orders: Order[];

  @Column({ default: Role.USER })
  role: Role;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @OneToOne(() => Profile, { persistence: false, cascade: true })
  @JoinColumn()
  profile: Profile;
}
