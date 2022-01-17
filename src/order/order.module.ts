import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { PromotionCode } from './entities/promotion-code.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PromotionCode])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
