import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ItemModule } from 'src/item/item.module';
import { ThirdPartyModule } from 'src/third-party/third-party.module';
import { UserModule } from 'src/user/user.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { PromotionCode } from './entities/promotion-code.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';
import { PromotionCodeService } from './promotion-code.service';
import { ShopController } from './shop.controller';
import { WsNotifyService } from './ws-notify.service';
import { WsGateway } from './ws.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, PromotionCode, Customer]),
    ThirdPartyModule,
    ItemModule,
    UserModule,
  ],
  controllers: [ShopController, OrderController, CustomerController],
  providers: [
    OrderService,
    PaymentService,
    PromotionCodeService,
    CaslAbilityFactory,
    CustomerService,
    WsGateway,
    WsNotifyService,
  ],
})
export class ShopModule {}
