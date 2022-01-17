import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AboutFeContainerService } from './about_fe_container.service';
import { AboutFeContainerDto } from './dto/about_fe_container.dto';
import { PhotoPreviewDto } from './dto/photo_preview.dto';
import { QualificationPreviewDto } from './dto/qualification_preview.dto';
import { SettingDto } from './dto/setting.dto';
import { SponcerContainerDto } from './dto/sponcer_container.dto';
import { TimelineEventDto } from './dto/timeline_event.dto';
import { PhotoPreviewService } from './photo_preview.service';
import { QualificationPreviewService } from './qualification_preview.service';
import { SettingService } from './setting.service';
import { SponcerContainerService } from './sponcer_container.service';
import { TimelineEventService } from './timeline_event.service';

@ApiTags('Setting')
@Controller('setting')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly timelineEventService: TimelineEventService,
    private readonly sponcerContainerService: SponcerContainerService,
    private readonly photoPreviewService: PhotoPreviewService,
    private readonly qualificationPreviewService: QualificationPreviewService,
    private readonly aboutFeContainerService: AboutFeContainerService,
  ) {}

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
    return this.timelineEventService.create(timelineEventDto, +settingid);
  }
  @Get('timeline_event')
  findAllTimelineEvent() {
    return this.timelineEventService.findAll();
  }

  @Get('timeline_event/:id')
  findOneTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.findOne(+id);
  }

  @Patch('timeline_event/:id')
  updateTimelineEvent(@Param('id') id: string, @Body() timelineEventDto: TimelineEventDto) {
    return this.timelineEventService.update(+id, timelineEventDto);
  }

  @Delete('timeline_event/:id')
  removeTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.remove(+id);
  }

  @Post('sponcer_container/:settingid')
  createSponcerContainer(
    @Body() sponcerContainerDto: SponcerContainerDto,
    @Param('settingid') settingid: string,
  ) {
    return this.sponcerContainerService.create(sponcerContainerDto, +settingid);
  }
  @Get('sponcer_container')
  findAllSponcerContainer() {
    return this.sponcerContainerService.findAll();
  }

  @Get('sponcer_container/:id')
  findOneSponcerContainer(@Param('id') id: string) {
    return this.sponcerContainerService.findOne(+id);
  }

  @Patch('sponcer_container/:id')
  updateSponcerContainer(
    @Param('id') id: string,
    @Body() sponcerContainerDto: SponcerContainerDto,
  ) {
    return this.sponcerContainerService.update(+id, sponcerContainerDto);
  }

  @Delete('sponcer_container/:id')
  removeSponcerContainer(@Param('id') id: string) {
    return this.sponcerContainerService.remove(+id);
  }

  @Post('photo_preview/:settingid')
  createPhotoPreview(
    @Body() photoPreviewDto: PhotoPreviewDto,
    @Param('settingid') settingid: string,
  ) {
    return this.photoPreviewService.create(photoPreviewDto, +settingid);
  }
  @Get('photo_preview')
  findAllPhotoPreview() {
    return this.photoPreviewService.findAll();
  }

  @Get('photo_preview/:id')
  findOnePhotoPreview(@Param('id') id: string) {
    return this.photoPreviewService.findOne(+id);
  }

  @Patch('photo_preview/:id')
  updatePhotoPreview(@Param('id') id: string, @Body() photoPreviewDto: PhotoPreviewDto) {
    return this.photoPreviewService.update(+id, photoPreviewDto);
  }

  @Delete('photo_preview/:id')
  removePhotoPreview(@Param('id') id: string) {
    return this.photoPreviewService.remove(+id);
  }

  @Post('qualification_preview/:settingid')
  createQualificationPreview(
    @Body() qualificationPreviewDto: QualificationPreviewDto,
    @Param('settingid') settingid: string,
  ) {
    return this.qualificationPreviewService.create(qualificationPreviewDto, +settingid);
  }
  @Get('qualification_preview')
  findAllQualificationPreview() {
    return this.qualificationPreviewService.findAll();
  }

  @Get('qualification_preview/:id')
  findOneQualificationPreview(@Param('id') id: string) {
    return this.qualificationPreviewService.findOne(+id);
  }

  @Patch('qualification_preview/:id')
  updateQualificationPreview(
    @Param('id') id: string,
    @Body() qualificationPreviewDto: QualificationPreviewDto,
  ) {
    return this.qualificationPreviewService.update(+id, qualificationPreviewDto);
  }

  @Delete('qualification_preview/:id')
  removeQualificationPreview(@Param('id') id: string) {
    return this.qualificationPreviewService.remove(+id);
  }

  @Post('about_fe_container/:settingid')
  createAboutFeContainer(
    @Body() aboutFeContainerDto: AboutFeContainerDto,
    @Param('settingid') settingid: string,
  ) {
    return this.aboutFeContainerService.create(aboutFeContainerDto, +settingid);
  }
  @Get('about_fe_container')
  findAllAboutFeContainer() {
    return this.aboutFeContainerService.findAll();
  }

  @Get('about_fe_container/:id')
  findOneAboutFeContainer(@Param('id') id: string) {
    return this.aboutFeContainerService.findOne(+id);
  }

  @Patch('about_fe_container/:id')
  updateAboutFeContainer(
    @Param('id') id: string,
    @Body() aboutFeContainerDto: AboutFeContainerDto,
  ) {
    return this.aboutFeContainerService.update(+id, aboutFeContainerDto);
  }

  @Delete('about_fe_container/:id')
  removeAboutFeContainer(@Param('id') id: string) {
    return this.aboutFeContainerService.remove(+id);
  }
}
