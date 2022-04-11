import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionCodeDto } from './create-promotion-code.dto';

export class UpdatePromotionCodeDto extends PartialType(CreatePromotionCodeDto) {}
