import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from 'src/item/item.module';
import { ThirdPartyModule } from 'src/third-party/third-party.module';
import { UserModule } from 'src/user/user.module';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { PromotionCode } from './entities/promotion-code.entity';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { PromotionCodeService } from './promotion-code.service';
import { ShopController } from './shop.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, PromotionCode, Customer]),
    ThirdPartyModule,
    ItemModule,
    UserModule,
  ],
  controllers: [ShopController],
  providers: [OrderService, PaymentService, PromotionCodeService],
})
export class OrderModule {}
