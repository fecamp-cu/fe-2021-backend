import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as faker from 'faker';
import * as moment from 'moment';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { createRandomSha256Text } from 'src/common/function/random-text';
import { Repository } from 'typeorm';
import { CreatePromotionCodeDto } from './dto/create-promotion-code.dto';
import { UpdatePromotionCodeDto } from './dto/update-promotion-code.dto';
import { PromotionCode } from './entities/promotion-code.entity';

@Injectable()
export class PromotionCodeService {
  constructor(
    @InjectRepository(PromotionCode) private promotionCodeRepository: Repository<PromotionCode>,
    private configService: ConfigService,
  ) {}

  async findWithPaginate(options: IPaginationOptions): Promise<Pagination<PromotionCode>> {
    const query = this.promotionCodeRepository.createQueryBuilder('code');
    return paginate<PromotionCode>(query, options);
  }

  async findOne(id: number): Promise<PromotionCode> {
    const code = await this.promotionCodeRepository.findOne(id);
    if (!code) {
      throw new NotFoundException({
        StatusCode: 404,
        reason: 'NOT_FOUND',
        message: `Promotion code, ${id}, not match with any code`,
      });
    }
    return code;
  }

  async update(id: number, updateDto: UpdatePromotionCodeDto): Promise<PromotionCode> {
    const code = await this.findOne(id);
    await this.promotionCodeRepository.update(id, updateDto);

    code.code = updateDto.code;
    code.type = updateDto.type;
    code.value = updateDto.value;
    code.isReuseable = updateDto.isReuseable;
    code.expiresDate = updateDto.expiresDate;

    return code;
  }

  async delete(id: number) {
    const promotionCode = await this.findOne(id);
    await this.promotionCodeRepository.softDelete(id);
    return promotionCode;
  }

  async generate(promotionCodeDto: CreatePromotionCodeDto): Promise<PromotionCode> {
    if (promotionCodeDto.isReuseable && !promotionCodeDto.expiresDate) {
      throw new BadRequestException({
        reason: 'MALFORM_INPUT',
        message: 'You must included expiresDate when isReuseable is true',
      });
    }

    promotionCodeDto.code = promotionCodeDto.code
      ? promotionCodeDto.code
      : createRandomSha256Text(this.configService.get<string>('secret.encryptionKey')).substring(
          0,
          10,
        );

    promotionCodeDto.value = promotionCodeDto.value
      ? promotionCodeDto.value
      : faker.datatype.number(50);

    const code = await this.promotionCodeRepository.save(promotionCodeDto);

    return new PromotionCode({
      id: code.id,
      type: code.type,
      code: code.code,
      value: code.value,
      isReuseable: code.isReuseable,
      startDate: code.startDate,
      expiresDate: code.expiresDate,
      isActived: code.isActived,
    });
  }

  async use(code: string): Promise<CreatePromotionCodeDto> {
    if (!code) {
      throw new BadRequestException({
        StatusCode: 400,
        reason: 'MALFORM_INPUT',
        message: 'You must included a code',
      });
    }

    const promotionCode = await this.promotionCodeRepository.findOne({ code });

    if (!promotionCode) {
      throw new NotFoundException({
        StatusCode: 404,
        reason: 'NOT_FOUND',
        message: `Promotion code, ${code}, not match with any code`,
      });
    }

    if (moment(promotionCode.startDate).isAfter(moment())) {
      throw new ForbiddenException({
        StatusCode: 403,
        reason: 'FORBIDDEN',
        message: `Promotion code, ${code}, not yet start`,
      });
    }

    if (promotionCode.expiresDate && moment(promotionCode.expiresDate).isBefore(moment())) {
      throw new ForbiddenException({
        StatusCode: 403,
        reason: 'CODE_EXPIRE',
        message: 'The promotion code is expired',
      });
    }

    if (promotionCode.isActived) {
      throw new ForbiddenException({
        StatusCode: 403,
        reason: 'CODE_ALREADY_USED',
        message: 'The promotion code is already activated',
      });
    }

    if (!promotionCode.isReuseable) {
      promotionCode.isActived = true;
      await this.promotionCodeRepository.save(promotionCode);
    }

    return promotionCode;
  }

  async getPromotionCode(code: string): Promise<PromotionCode> {
    if (!code) {
      throw new BadRequestException({
        StatusCode: 400,
        reason: 'MALFORM_INPUT',
        message: 'You must included a code',
      });
    }

    const promotionCode = await this.promotionCodeRepository.findOne({ code });

    if (!promotionCode) {
      throw new NotFoundException({
        StatusCode: 404,
        reason: 'NOT_FOUND',
        message: `Promotion code, ${code}, not match with any code`,
      });
    }

    return promotionCode;
  }
}
