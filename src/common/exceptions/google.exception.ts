import { HttpException, HttpStatus } from '@nestjs/common';

export class GoogleException extends HttpException {
  constructor(
    message: string = 'Google API Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ status, error: message }, status);
  }
}
