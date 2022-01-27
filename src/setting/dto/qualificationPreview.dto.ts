import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class QualificationPreviewDto {
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  order: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  text: string;

  constructor(partial: Partial<QualificationPreviewDto>) {
    Object.assign(this, partial);
  }
}
