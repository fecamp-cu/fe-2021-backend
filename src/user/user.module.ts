import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/auth/entities/token.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Item } from 'src/item/entities/item.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Order } from 'src/shop/entities/order.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Token, Item, Order])],
  controllers: [UserController],
  providers: [UserService, CaslAbilityFactory],
  exports: [UserService],
})
export class UserModule {}
