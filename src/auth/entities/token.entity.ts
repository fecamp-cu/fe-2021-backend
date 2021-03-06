import { ServiceType } from 'src/common/enums/service-type';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'service_type' })
  serviceType: ServiceType;

  @Column({ name: 'service_user_id', nullable: true })
  serviceUserId: string;

  @Column({ name: 'id_token', nullable: true })
  idToken: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Index()
  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'expires_date' })
  expiresDate: Date;

  @ManyToOne(() => User, user => user.tokens)
  user: User;

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
