import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { OrderDto } from './dto/order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

  async create(orderDto: OrderDto): Promise<OrderDto> {
    const order = await this.orderRepository.create(orderDto);
    const savedOrder = await this.orderRepository.save(order);
    return this.rawToDTO(savedOrder);
  }

  async findAll() {
    return await this.orderRepository.find({ relations: ['customer'] });
  }

  async findOne(id: number, relations: string[] = []): Promise<OrderDto> {
    const order = await this.orderRepository.findOne(id, { relations });

    if (!order) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: `Not found order`,
      });
    }

    return this.rawToDTO(order);
  }

  async findBySourceId(sourceId: string, relations: string[] = []) {
    const order = await this.orderRepository.findOne({ sourceId }, { relations });

    if (!order) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: `Not found order`,
      });
    }

    return this.rawToDTO(order);
  }

  async update(id: number, orderDto: OrderDto, relations: string[] = []): Promise<OrderDto> {
    const update: UpdateResult = await this.orderRepository.update(id, orderDto);

    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'user not found',
      });
    }

    return await this.findOne(id, relations);
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
      paidAt: order.paidAt,
    });

    if (order.customer) {
      orderDto.customer = order.customer;
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
