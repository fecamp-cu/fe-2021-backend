import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class SponcerContainerDto {
  id: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  @IsUrl()
  img_url: string;

  constructor(partial: Partial<SponcerContainerDto>) {
    Object.assign(this, partial);
  }
}
