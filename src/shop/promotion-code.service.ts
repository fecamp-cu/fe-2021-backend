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
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PromotionCodeType } from 'src/common/enums/promotion-code';
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

  async findOne(id: number) {
    const code = await this.promotionCodeRepository.findOne(id);
    if (!code) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: `Promotion code, ${id}, not match with any code`,
      });
    }
    return this.rawToDTO(code);
  }

  async update(id: number, updateDto: UpdatePromotionCodeDto) {
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

  async generate(
    type: PromotionCodeType,
    expiresDate: Date,
    isReuseable: boolean = false,
    code: string = crypto
      .SHA256(
        faker.datatype.string(faker.datatype.number(100)) +
          this.configService.get<string>('secret.encryptionKey') +
          Date.now(),
      )
      .toString()
      .substring(0, 10),
    value: number = faker.datatype.number(50),
  ): Promise<CreatePromotionCodeDto> {
    if (isReuseable && !expiresDate) {
      throw new BadRequestException({
        reason: 'MALFORM_INPUT',
        message: 'You must included expiresDate when isReuseable is true',
      });
    }

    const promotionCodeDto = new CreatePromotionCodeDto({
      code,
      type,
      isReuseable,
      value,
    });

    if (expiresDate) {
      promotionCodeDto.expiresDate = expiresDate;
    }

    const promotionCode = await this.promotionCodeRepository.create(promotionCodeDto);
    await this.promotionCodeRepository.save(promotionCode);

    return this.rawToDTO(promotionCode);
  }

  async use(code: string): Promise<CreatePromotionCodeDto> {
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

    if (!promotionCode.isReuseable) {
      promotionCode.isActived = true;
      await this.promotionCodeRepository.save(promotionCode);
    }

    return this.rawToDTO(promotionCode);
  }

  async getPromotionCode(code: string): Promise<CreatePromotionCodeDto> {
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

    return this.rawToDTO(promotionCode);
  }

  private rawToDTO(promotionCode: PromotionCode) {
    return new CreatePromotionCodeDto({
      code: promotionCode.code,
      type: promotionCode.type,
      value: promotionCode.value,
      isReuseable: promotionCode.isReuseable,
      expiresDate: promotionCode.expiresDate,
    });
  }
}
