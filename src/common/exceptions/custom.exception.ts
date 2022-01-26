import { HttpStatus } from '@nestjs/common';

export class CustomException extends Error {
  public name: string;
  public status: HttpStatus;

  constructor(
    name: string = 'Custom Exception',
    message: string = 'Something Wrong 😱',
    status: HttpStatus,
  ) {
    super(message);
    this.name = name;
    this.status = status;
  }
}
