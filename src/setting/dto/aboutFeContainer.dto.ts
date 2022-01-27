import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class AboutFeContainerDto {
  id: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  order: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  text: string;

  constructor(partial: Partial<AboutFeContainerDto>) {
    Object.assign(this, partial);
  }
}
