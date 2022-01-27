import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { TimelineEventDto } from './dto/timelineEvent.dto';
import { TimelineEventService } from './timelineEvent.service';

@ApiTags('TimelineEvent')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('setting/timeline')
export class TimelineEventController {
  constructor(private readonly timelineEventService: TimelineEventService) {}

  @Post(':settingid')
  @CheckPolicies(new ManagePolicyHandler())
  createTimelineEvent(
    @Body() timelineEventDto: TimelineEventDto,
    @Param('settingid') settingid: string,
  ) {
    return this.timelineEventService.create(timelineEventDto, +settingid);
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAllTimelineEvent() {
    return this.timelineEventService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findOneTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManagePolicyHandler())
  updateTimelineEvent(@Param('id') id: string, @Body() timelineEventDto: TimelineEventDto) {
    return this.timelineEventService.update(+id, timelineEventDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  removeTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.remove(+id);
  }
}
