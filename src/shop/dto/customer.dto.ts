import { UserDto } from 'src/user/dto/user.dto';
import { OrderDto } from './order.dto';

export class CustomerDto {
  id: number;

  email: string;

  firstname: string;

  lastname: string;

  tel: string;

  grade: string;

  school: string;

  address: string;

  subdistrict: string;

  district: string;

  province: string;

  postcode: string;

  point: number;

  orders: OrderDto[];

  user: UserDto;

  constructor(partial: Partial<CustomerDto>) {
    Object.assign(this, partial);
  }
}
