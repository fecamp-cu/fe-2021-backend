import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class PhotoPreviewDto {
  id: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  @IsUrl()
  imgUrl: string;

  constructor(partial: Partial<PhotoPreviewDto>) {
    Object.assign(this, partial);
  }
}
