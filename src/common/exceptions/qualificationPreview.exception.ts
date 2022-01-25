import { HttpException, HttpStatus } from '@nestjs/common';

export class QualificationPreviewException extends HttpException {
  constructor(
    message: string = 'QualificationPreview API Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ status, error: message }, status);
  }
}
