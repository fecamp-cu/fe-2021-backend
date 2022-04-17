import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  public name: string;

  constructor(
    name: string = 'Custom Exception',
    message: string = 'Something Wrong 😱',
    status: HttpStatus,
  ) {
    super(message, status);
    this.name = name;
  }
}
