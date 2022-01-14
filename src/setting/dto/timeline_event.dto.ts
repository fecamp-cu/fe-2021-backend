import { ApiProperty } from '@nestjs/swagger';

export class TimelineEventDto {
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  event_date: Date;

  constructor(partial: Partial<TimelineEventDto>) {
    Object.assign(this, partial);
  }
}
