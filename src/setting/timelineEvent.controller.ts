import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { TimelineEventDto } from './dto/timelineEvent.dto';
import { TimelineEventService } from './timelineEvent.service';

@ApiTags('TimelineEvent')
@Controller('timeline_event')
export class TimelineEventController {
  constructor(private readonly timelineEventService: TimelineEventService) {}

  @Post(':settingid')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  createTimelineEvent(
    @Body() timelineEventDto: TimelineEventDto,
    @Param('settingid') settingid: string,
  ) {
    return this.timelineEventService.create(timelineEventDto, +settingid);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  findAllTimelineEvent() {
    return this.timelineEventService.findAll();
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  findOneTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  updateTimelineEvent(@Param('id') id: string, @Body() timelineEventDto: TimelineEventDto) {
    return this.timelineEventService.update(+id, timelineEventDto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  removeTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.remove(+id);
  }
}
