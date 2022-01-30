import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { UserModule } from 'src/user/user.module';
import { ItemIndex } from './entities/item-index.entity';
import { Item } from './entities/item.entity';
import { ItemIndexService } from './item-index.service';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemIndex]), UserModule],
  controllers: [ItemController],
  providers: [ItemService, ItemIndexService, CaslAbilityFactory],
  exports: [ItemService],
})
export class ItemModule {}
