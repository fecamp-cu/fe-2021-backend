import { HttpException, HttpStatus } from '@nestjs/common';

export class AboutFeContainerException extends HttpException {
  constructor(
    name: string = 'AboutFeContainer API Error',
    message: string = 'Something Wrong :(',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ name, status, error: message }, status);
  }
}
