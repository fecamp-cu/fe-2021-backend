import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class GoogleException extends CustomException {
  constructor(
    message: string = 'Something Wrong :(',
    name: string = 'Google API Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(name, message, status);
  }
}
