import { HttpException, HttpStatus } from '@nestjs/common';

export class TimelineEventException extends HttpException {
  constructor(
    message: string = 'TimelineEvent API Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ status, error: message }, status);
  }
}
