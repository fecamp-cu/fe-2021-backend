import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemIndex } from './entities/item-index.entity';
import { Item } from './entities/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemIndex])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
