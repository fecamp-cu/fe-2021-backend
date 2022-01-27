import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUrl } from 'class-validator';

export class PhotoPreviewDto {
  id: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  order: number;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  imgUrl: string;

  constructor(partial: Partial<PhotoPreviewDto>) {
    Object.assign(this, partial);
  }
}
