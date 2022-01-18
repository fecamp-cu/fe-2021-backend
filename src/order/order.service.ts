import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

  create(orderDto: OrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, orderDto: OrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  public rawToDTO(order: Order) {
    const orderDto = new OrderDto({
      id: order.id,
      chargeId: order.chargeId,
      transactionId: order.transactionId,
      paymentMethod: order.paymentMethod,
      amount: order.amount,
      paid_at: order.paid_at,
    });

    if (order.user) {
      orderDto.user = order.user;
    }

    if (order.items) {
      orderDto.items = order.items;
    }

    if (order.code) {
      orderDto.code = order.code;
    }

    return orderDto;
  }
}
