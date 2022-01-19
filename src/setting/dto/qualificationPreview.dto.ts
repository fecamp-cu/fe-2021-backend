import { ApiProperty } from '@nestjs/swagger';

export class QualificationPreviewDto {
  id: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  text: string;

  constructor(partial: Partial<QualificationPreviewDto>) {
    Object.assign(this, partial);
  }
}
