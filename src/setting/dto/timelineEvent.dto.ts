import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';

export class TimelineEventDto {
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  @IsISO8601()
  eventStartDate: Date;

  @ApiProperty()
  @IsISO8601()
  eventEndDate: Date;

  constructor(partial: Partial<TimelineEventDto>) {
    Object.assign(this, partial);
  }
}
