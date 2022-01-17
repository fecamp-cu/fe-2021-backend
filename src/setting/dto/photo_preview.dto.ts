import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class PhotoPreviewDto {
  id: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  @IsUrl()
  img_url: string;

  constructor(partial: Partial<PhotoPreviewDto>) {
    Object.assign(this, partial);
  }
}
