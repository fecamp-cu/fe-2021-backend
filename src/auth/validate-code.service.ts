import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeType } from 'src/common/types/validate-code';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ValidateCodeDto } from './dto/validate-code.dto';
import { ValidateCode } from './entities/validate-code.entity';

@Injectable()
export class ValidateCodeService {
  constructor(
    @InjectRepository(ValidateCode) private validateCodeRepository: Repository<ValidateCode>,
  ) {}

  async generate(type: CodeType, expireDate?: Date): Promise<ValidateCodeDto> {
    const code = await uuidv4();

    const validateCodeDto = new ValidateCodeDto({
      code,
      type,
    });

    if (expireDate) {
      validateCodeDto.expiredDate = expireDate;
    }

    const validateCode = await this.validateCodeRepository.create(validateCodeDto);

    const createdValidateCode = await this.validateCodeRepository.save(validateCode);
    return this.rawToDTO(createdValidateCode);
  }

  async validateCode(codeType: CodeType, token: string): Promise<boolean> {
    const queriedCode = await this.validateCodeRepository.findOne({ code: token, type: codeType });

    if (!queriedCode) {
      throw new BadRequestException({
        reason: 'MALFORM_INPUT',
        message: 'You must included a token',
      });
    }

    if (queriedCode.expiredDate && queriedCode.expiredDate.getTime() < Date.now()) {
      throw new UnauthorizedException({
        reason: 'TOKEN_EXPIRE',
        message: 'The token is expired',
      });
    }

    if (queriedCode.isUsed) {
      throw new UnauthorizedException({
        reason: 'TOKEN_ALREADY_USED',
        message: 'The token is already used',
      });
    }

    queriedCode.isUsed = true;
    this.validateCodeRepository.save(queriedCode);

    return true;
  }

  private rawToDTO(validateCode: ValidateCode): ValidateCodeDto {
    return new ValidateCodeDto({
      id: validateCode.id,
      code: validateCode.code,
      type: validateCode.type,
      expiredDate: validateCode.expiredDate,
    });
  }
}
