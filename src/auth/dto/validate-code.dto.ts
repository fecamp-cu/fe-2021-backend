import { CodeType } from 'src/common/enums/validate-code-type';
import { UserDto } from 'src/user/dto/user.dto';

export class ValidateCodeDto {
  id: number;

  type: CodeType;

  code: string;

  isUsed: boolean;

  expiredDate: Date;

  user: UserDto;

  constructor(partial: Partial<ValidateCodeDto>) {
    Object.assign(this, partial);
  }
}
