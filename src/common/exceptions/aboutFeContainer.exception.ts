import { HttpException, HttpStatus } from '@nestjs/common';

export class AboutFeContainerException extends HttpException {
  constructor(
    message: string = 'AboutFeContainer API Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ status, error: message }, status);
  }
}
