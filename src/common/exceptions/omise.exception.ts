import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class OmiseException extends CustomException {
  constructor(
    message: string = 'Something Wrong :(',
    name: string = 'Omise API Error',
    status: HttpStatus = HttpStatus.SERVICE_UNAVAILABLE,
  ) {
    super(name, message, status);
  }
}
