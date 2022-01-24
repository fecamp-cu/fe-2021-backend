import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';

export class GoogleException extends CustomException {
  constructor(
    name: string = 'Google API Error',
    message: string = 'Something Wrong :(',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(name, message, status);
  }
}
