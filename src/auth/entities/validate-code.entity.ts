import { CodeType } from 'src/common/types/validate-code';
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
export class ValidateCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type' })
  type: CodeType;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'expired_date', nullable: true })
  expiredDate: Date;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @ManyToOne(() => User, user => user.verifiedCodes)
  user: User;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  constructor(partial: Partial<ValidateCode>) {
    Object.assign(this, partial);
  }
}
