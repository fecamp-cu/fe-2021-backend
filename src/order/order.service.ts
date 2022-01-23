import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeORMException } from 'src/common/exceptions/typeorm.exception';
import { ItemDto } from 'src/item/dto/item.dto';
import { Repository, UpdateResult } from 'typeorm';
import { OrderItemDto } from './dto/order-item.dto';
import { OrderDto } from './dto/order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(orderDto: OrderDto): Promise<OrderDto> {
    const order = await this.orderRepository.create(orderDto);
    try {
      const savedOrder = await this.orderRepository.save(order);
      return this.rawToDTO(savedOrder);
    } catch (err) {
      throw new TypeORMException(err);
    }
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

  async createMultiOrderItems(
    items: ItemDto[],
    order: OrderDto,
    quantities: number[],
  ): Promise<OrderItemDto[]> {
    const createdOrderItems = [];
    for (let i = 0; i < items.length; i++) {
      const quantity = quantities[i];
      const item = items[i];
      const orderItemDto = new OrderItemDto({
        quantity,
        order,
        item,
      });
      const orderItem = await this.orderItemRepository.create(orderItemDto);
      createdOrderItems.push(orderItem);
    }

    await this.orderItemRepository.save(createdOrderItems);

    return createdOrderItems.map(orderItem => this.orderItemRawToDTO(orderItem));
  }

  async getOrderWithItems(orderId: number): Promise<OrderDto> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :orderId', { orderId })
      .leftJoinAndSelect('order.items', 'order_item')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order_item.item', 'item')
      .getOne();
    return order;
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

  public orderItemRawToDTO(orderItem: OrderItem) {
    const orderItemDto = new OrderItemDto({
      id: orderItem.id,
      quantity: orderItem.quantity,
      order: orderItem.order,
      item: orderItem.item,
    });

    return orderItemDto;
  }
}
