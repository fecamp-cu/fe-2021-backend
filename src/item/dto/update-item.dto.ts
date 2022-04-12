import { PartialType } from '@nestjs/swagger';
import { ItemDto } from './item.dto';

export class UpdateItemDto extends PartialType(ItemDto) {}
