import { CodeType } from 'src/common/types/validate-code';

export class ValidateCodeDto {
  id: number;

  type: CodeType;

  code: string;

  expiredDate: Date;

  constructor(partial: Partial<ValidateCodeDto>) {
    Object.assign(this, partial);
  }
}
