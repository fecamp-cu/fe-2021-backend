import { HttpException, HttpStatus } from '@nestjs/common';

export class TypeORMException extends HttpException {
  constructor(
    message: string = 'Typeorm Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ status, error: message }, status);
  }
}
