import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeType } from 'src/common/enums/validate-code-type';
import { UserDto } from 'src/user/dto/user.dto';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ValidateCodeDto } from './dto/validate-code.dto';
import { ValidateCode } from './entities/validate-code.entity';

@Injectable()
export class ValidateCodeService {
  constructor(
    @InjectRepository(ValidateCode) private validateCodeRepository: Repository<ValidateCode>,
  ) {}

  async generate(userDto: UserDto, type: CodeType, expireDate?: Date): Promise<ValidateCodeDto> {
    const code = await uuidv4();

    const validateCodeDto = new ValidateCodeDto({
      code,
      type,
      user: userDto,
    });

    if (expireDate) {
      validateCodeDto.expiredDate = expireDate;
    }

    const validateCode = await this.validateCodeRepository.create(validateCodeDto);

    const createdValidateCode = await this.validateCodeRepository.save(validateCode);
    return this.rawToDTO(createdValidateCode);
  }

  async use(uid: number, codeType: CodeType, token: string): Promise<boolean> {
    if (!token) {
      throw new BadRequestException({
        reason: 'MALFORM_INPUT',
        message: 'You must included a token',
      });
    }

    const queriedCode: ValidateCodeDto = await this.validateCodeRepository.findOne(
      {
        code: token,
        type: codeType,
      },
      { relations: ['user'] },
    );

    if (!queriedCode) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Token not match with any code',
      });
    }

    if (queriedCode.user.id !== uid) {
      throw new UnauthorizedException({
        reason: 'INVALID_USER',
        message: 'Only owner of the token can active it',
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
    await this.validateCodeRepository.save(queriedCode);

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
