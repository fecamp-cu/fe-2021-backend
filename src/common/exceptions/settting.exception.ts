import { HttpException, HttpStatus } from '@nestjs/common';

export class SettingException extends HttpException {
  constructor(
    message: string = 'Setting API Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ status, error: message }, status);
  }
}
