import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TimelineEventDto } from './dto/timelineEvent.dto';
import { TimelineEventService } from './timelineEvent.service';

@ApiTags('TimelineEvent')
@Controller('timeline_event')
export class TimelineEventController {
  constructor(private readonly timelineEventService: TimelineEventService) {}
  @Post(':settingid')
  createTimelineEvent(
    @Body() timelineEventDto: TimelineEventDto,
    @Param('settingid') settingid: string,
  ) {
    return this.timelineEventService.create(timelineEventDto, +settingid);
  }

  @Get()
  findAllTimelineEvent() {
    return this.timelineEventService.findAll();
  }

  @Get(':id')
  findOneTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.findOne(+id);
  }

  @Patch(':id')
  updateTimelineEvent(@Param('id') id: string, @Body() timelineEventDto: TimelineEventDto) {
    return this.timelineEventService.update(+id, timelineEventDto);
  }

  @Delete(':id')
  removeTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.remove(+id);
  }
}
