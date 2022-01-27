import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUrl } from 'class-validator';

export class SponcerContainerDto {
  id: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  order: number;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  imgUrl: string;

  constructor(partial: Partial<SponcerContainerDto>) {
    Object.assign(this, partial);
  }
}
