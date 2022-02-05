import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class TimelineEventDto {
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  eventStartDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsISO8601()
  eventEndDate: Date;

  constructor(partial: Partial<TimelineEventDto>) {
    Object.assign(this, partial);
  }
}
