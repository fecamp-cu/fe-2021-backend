import { HttpException, HttpStatus } from '@nestjs/common';

export class SponcerContainerException extends HttpException {
  constructor(
    message: string = 'SponcerContainer API Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ status, error: message }, status);
  }
}
