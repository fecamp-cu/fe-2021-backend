import { Role } from 'src/common/enums/role';
import { Profile } from 'src/profile/entities/profile.entity';
import { Token } from 'src/token/entities/token.entity';
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

  @OneToMany(() => Token, token => token.user, { persistence: false, cascade: true })
  tokens: Token[];

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
