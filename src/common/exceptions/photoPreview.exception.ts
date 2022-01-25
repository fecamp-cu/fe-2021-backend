import { HttpException, HttpStatus } from '@nestjs/common';

export class PhotoPreviewException extends HttpException {
  constructor(
    message: string = 'PhotoPreview API Error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ status, error: message }, status);
  }
}
