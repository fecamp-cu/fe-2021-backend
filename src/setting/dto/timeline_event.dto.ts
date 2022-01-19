import { ApiProperty } from '@nestjs/swagger';

export class TimelineEventDto {
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  eventDate: Date;

  constructor(partial: Partial<TimelineEventDto>) {
    Object.assign(this, partial);
  }
}
