import { HttpException, HttpStatus } from '@nestjs/common';

export class OmiseException extends HttpException {
  constructor(
    message: string = 'Omise API Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ status, error: message }, status);
  }
}
