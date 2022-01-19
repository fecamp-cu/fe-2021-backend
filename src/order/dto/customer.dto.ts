import { UserDto } from 'src/user/dto/user.dto';
import { OrderDto } from './order.dto';

export class CustomerDto {
  id: number;

  email: string;

  firstname: string;

  lastname: string;

  orders: OrderDto[];

  user: UserDto;
}
