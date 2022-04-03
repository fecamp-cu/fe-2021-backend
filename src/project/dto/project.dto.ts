import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class ProjectDto {
  id: number;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  publishDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  endDate: Date;

  constructor(partial: Partial<ProjectDto>) {
    Object.assign(this, partial);
  }
}
