import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class TimelineEventDto {
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  @IsDate()
  event_date: Date;

  constructor(partial: Partial<TimelineEventDto>) {
    Object.assign(this, partial);
  }
}
