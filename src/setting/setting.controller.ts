import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingDto } from './dto/setting.dto';
import { SponcerContainerDto } from './dto/sponcer_container.dto';
import { TimelineEventDto } from './dto/timeline_event.dto';
import { SettingService } from './setting.service';

@ApiTags('Setting')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  create(@Body() settingDto: SettingDto) {
    return this.settingService.createSetting(settingDto);
  }

  @Get()
  findAll() {
    return this.settingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() settingDto: SettingDto) {
    return this.settingService.update(+id, settingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }
  @Post('timeline_event/:settingid')
  createTimelineEvent(
    @Body() timelineEventDto: TimelineEventDto,
    @Param('settingid') settingid: string,
  ) {
    return this.settingService.createTimelineEvent(timelineEventDto, +settingid);
  }
  @Get('timeline_event')
  findAllTimelineEvent() {
    return this.settingService.findAllTimelineEvent();
  }

  @Get('timeline_event/:id')
  findOneTimelineEvent(@Param('id') id: string) {
    return this.settingService.findOneTimelineEvent(+id);
  }

  @Patch('timeline_event/:id')
  updateTimelineEvent(@Param('id') id: string, @Body() timelineEventDto: TimelineEventDto) {
    return this.settingService.updateTimelineEvent(+id, timelineEventDto);
  }

  @Delete('timeline_event/:id')
  removeTimelineEvent(@Param('id') id: string) {
    return this.settingService.removeTimelineEvent(+id);
  }

  @Post('timeline_event/:settingid')
  createSponcerContainer(
    @Body() sponcerContainerDto: SponcerContainerDto,
    @Param('settingid') settingid: string,
  ) {
    return this.settingService.createSponcerContainer(sponcerContainerDto, +settingid);
  }
  @Get('timeline_event')
  findAllSponcerContainer() {
    return this.settingService.findAllSponcerContainer();
  }

  @Get('timeline_event/:id')
  findOneSponcerContainer(@Param('id') id: string) {
    return this.settingService.findOneSponcerContainer(+id);
  }

  @Patch('timeline_event/:id')
  updateSponcerContainer(
    @Param('id') id: string,
    @Body() sponcerContainerDto: SponcerContainerDto,
  ) {
    return this.settingService.updateSponcerContainer(+id, sponcerContainerDto);
  }

  @Delete('timeline_event/:id')
  removeSponcerContainer(@Param('id') id: string) {
    return this.settingService.removeSponcerContainer(+id);
  }
}
