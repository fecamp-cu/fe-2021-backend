import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  tel: number;

  @Column()
  grade: string;

  @Column()
  school: string;

  @Column()
  address: string;

  @Column({ name: 'sub_district' })
  subdistrict: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @Column()
  postcode: number;
}
