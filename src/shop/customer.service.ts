import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private customerRepository: Repository<Customer>) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer: Customer = await this.customerRepository.findOne(id);

    if (!customer) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found customer' });
    }

    return customer;
  }

  async update(id: number, Customer: Customer): Promise<Customer> {
    const customer: Customer = await this.findOne(id);
    await this.customerRepository.update(id, Customer);

    return customer;
  }

  async remove(id: number): Promise<Customer> {
    const customer = await this.findOne(id);
    await this.customerRepository.softDelete(id);

    return customer;
  }
}
