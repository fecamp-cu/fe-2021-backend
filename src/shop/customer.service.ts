import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private customerRepository: Repository<Customer>) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findWithPaginate(options: IPaginationOptions): Promise<Pagination<Customer>> {
    const query = this.customerRepository.createQueryBuilder('customer');

    return paginate<Customer>(query, options);
  }

  async findOne(id: number): Promise<Customer> {
    const customer: Customer = await this.customerRepository.findOne(id);

    if (!customer) {
      throw new NotFoundException({
        StatusCode: 404,
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found customer',
      });
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
