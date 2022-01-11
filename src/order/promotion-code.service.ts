import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto-js';
import * as faker from 'faker';
import { PromotionCodeType } from 'src/common/enums/promotion-code';
import { Repository } from 'typeorm';
import { PromotionCodeDto } from './dto/promotion-code.dto';
import { PromotionCode } from './entities/promotion-code.entity';

@Injectable()
export class PromotionCodeService {
  constructor(
    @InjectRepository(PromotionCode) private promotionCodeRepository: Repository<PromotionCode>,
    private configService: ConfigService,
  ) {}

  async generate(
    type: PromotionCodeType,
    expiresDate: Date,
    code: string = crypto
      .SHA256(
        faker.datatype.string(faker.datatype.number(100)) +
          this.configService.get<string>('secret.encryptionKey') +
          Date.now(),
      )
      .toString()
      .substring(0, 10),
    value: number = faker.datatype.number(50),
  ): Promise<PromotionCodeDto> {
    const promotionCodeDto = new PromotionCodeDto({
      code,
      type,
      expiresDate,
      value,
    });

    const promotionCode = await this.promotionCodeRepository.create(promotionCodeDto);
    await this.promotionCodeRepository.save(promotionCode);

    return promotionCode;
  }

  async use(code: string): Promise<boolean> {
    if (!code) {
      throw new BadRequestException({
        reason: 'MALFORM_INPUT',
        message: 'You must included a code',
      });
    }

    const promotionCode = await this.promotionCodeRepository.findOne({ code });

    if (!promotionCode) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: `Promotion code, ${code}, not match with any code`,
      });
    }

    if (promotionCode.expiresDate && promotionCode.expiresDate.getTime() < Date.now()) {
      throw new UnauthorizedException({
        reason: 'CODE_EXPIRE',
        message: 'The promotion code is expired',
      });
    }

    if (promotionCode.isActived) {
      throw new UnauthorizedException({
        reason: 'CODE_ALREADY_USED',
        message: 'The promotion code is already activated',
      });
    }

    promotionCode.isActived = true;
    await this.promotionCodeRepository.save(promotionCode);

    return true;
  }

  async getPromotionCode(code: string): Promise<PromotionCodeDto> {
    if (!code) {
      throw new BadRequestException({
        reason: 'MALFORM_INPUT',
        message: 'You must included a code',
      });
    }

    const promotionCode = await this.promotionCodeRepository.findOne({ code });

    if (!promotionCode) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: `Promotion code, ${code}, not match with any code`,
      });
    }

    return promotionCode;
  }
}