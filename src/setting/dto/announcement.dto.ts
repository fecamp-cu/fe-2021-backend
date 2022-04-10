import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsISO8601, IsOptional, IsString } from 'class-validator';

export class AnnouncementDto {
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  header: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  dateStart: Date;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  dateEnd: Date;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  order: number;

  constructor(partial: Partial<AnnouncementDto>) {
    Object.assign(this, partial);
  }
}
