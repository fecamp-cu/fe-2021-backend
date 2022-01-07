import { ServiceType } from 'src/common/types/token';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'service_type' })
  serviceType: ServiceType;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'expires_date' })
  expiresDate: Date;

  @CreateDateColumn({ name: 'created_date', select: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date', select: false })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date', select: false })
  deletedDate: Date;

  constructor(partial: Partial<Token>) {
    Object.assign(this, partial);
  }
}
