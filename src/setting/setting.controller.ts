import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AboutFeContainerService } from './aboutFeContainer.service';
import { AboutFeContainerDto } from './dto/aboutFeContainer.dto';
import { PhotoPreviewDto } from './dto/photoPreview.dto';
import { QualificationPreviewDto } from './dto/qualificationPreview.dto';
import { SettingDto } from './dto/setting.dto';
import { SponcerContainerDto } from './dto/sponcerContainer.dto';
import { TimelineEventDto } from './dto/timelineEvent.dto';
import { PhotoPreviewService } from './photoPreview.service';
import { QualificationPreviewService } from './qualificationPreview.service';
import { SettingService } from './setting.service';
import { SponcerContainerService } from './sponcerContainer.service';
import { TimelineEventService } from './timelineEvent.service';

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
  @ApiTags('Setting')
  @Post()
  create(@Body() settingDto: SettingDto) {
    return this.settingService.createSetting(settingDto);
  }
  @ApiTags('Setting')
  @Get()
  findAll() {
    return this.settingService.findAll();
  }
  @ApiTags('Setting')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingService.findOne(+id);
  }
  @ApiTags('Setting')
  @Patch(':id')
  update(@Param('id') id: string, @Body() settingDto: SettingDto) {
    return this.settingService.update(+id, settingDto);
  }
  @ApiTags('Setting')
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.settingService.activate(+id);
  }
  @ApiTags('Setting')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }
  @ApiTags('TimelineEvent')
  @Post('timeline_event/:settingid')
  createTimelineEvent(
    @Body() timelineEventDto: TimelineEventDto,
    @Param('settingid') settingid: string,
  ) {
    return this.timelineEventService.create(timelineEventDto, +settingid);
  }
  @ApiTags('TimelineEvent')
  @Get('timeline_event')
  findAllTimelineEvent() {
    return this.timelineEventService.findAll();
  }
  @ApiTags('TimelineEvent')
  @Get('timeline_event/:id')
  findOneTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.findOne(+id);
  }
  @ApiTags('TimelineEvent')
  @Patch('timeline_event/:id')
  updateTimelineEvent(@Param('id') id: string, @Body() timelineEventDto: TimelineEventDto) {
    return this.timelineEventService.update(+id, timelineEventDto);
  }
  @ApiTags('TimelineEvent')
  @Delete('timeline_event/:id')
  removeTimelineEvent(@Param('id') id: string) {
    return this.timelineEventService.remove(+id);
  }
  @ApiTags('SponcerContainer')
  @Post('sponcer_container/:settingid')
  createSponcerContainer(
    @Body() sponcerContainerDto: SponcerContainerDto,
    @Param('settingid') settingid: string,
  ) {
    return this.sponcerContainerService.create(sponcerContainerDto, +settingid);
  }
  @ApiTags('SponcerContainer')
  @Get('sponcer_container')
  findAllSponcerContainer() {
    return this.sponcerContainerService.findAll();
  }
  @ApiTags('SponcerContainer')
  @Get('sponcer_container/:id')
  findOneSponcerContainer(@Param('id') id: string) {
    return this.sponcerContainerService.findOne(+id);
  }
  @ApiTags('SponcerContainer')
  @Patch('sponcer_container/:id')
  updateSponcerContainer(
    @Param('id') id: string,
    @Body() sponcerContainerDto: SponcerContainerDto,
  ) {
    return this.sponcerContainerService.update(+id, sponcerContainerDto);
  }
  @ApiTags('SponcerContainer')
  @Delete('sponcer_container/:id')
  removeSponcerContainer(@Param('id') id: string) {
    return this.sponcerContainerService.remove(+id);
  }
  @ApiTags('PhotoPreview')
  @Post('photo_preview/:settingid')
  createPhotoPreview(
    @Body() photoPreviewDto: PhotoPreviewDto,
    @Param('settingid') settingid: string,
  ) {
    return this.photoPreviewService.create(photoPreviewDto, +settingid);
  }
  @ApiTags('PhotoPreview')
  @Get('photo_preview')
  findAllPhotoPreview() {
    return this.photoPreviewService.findAll();
  }
  @ApiTags('PhotoPreview')
  @Get('photo_preview/:id')
  findOnePhotoPreview(@Param('id') id: string) {
    return this.photoPreviewService.findOne(+id);
  }
  @ApiTags('PhotoPreview')
  @Patch('photo_preview/:id')
  updatePhotoPreview(@Param('id') id: string, @Body() photoPreviewDto: PhotoPreviewDto) {
    return this.photoPreviewService.update(+id, photoPreviewDto);
  }
  @ApiTags('PhotoPreview')
  @Delete('photo_preview/:id')
  removePhotoPreview(@Param('id') id: string) {
    return this.photoPreviewService.remove(+id);
  }
  @ApiTags('QualificationPreview')
  @Post('qualification_preview/:settingid')
  createQualificationPreview(
    @Body() qualificationPreviewDto: QualificationPreviewDto,
    @Param('settingid') settingid: string,
  ) {
    return this.qualificationPreviewService.create(qualificationPreviewDto, +settingid);
  }
  @ApiTags('QualificationPreview')
  @Get('qualification_preview')
  findAllQualificationPreview() {
    return this.qualificationPreviewService.findAll();
  }
  @ApiTags('QualificationPreview')
  @Get('qualification_preview/:id')
  findOneQualificationPreview(@Param('id') id: string) {
    return this.qualificationPreviewService.findOne(+id);
  }
  @ApiTags('QualificationPreview')
  @Patch('qualification_preview/:id')
  updateQualificationPreview(
    @Param('id') id: string,
    @Body() qualificationPreviewDto: QualificationPreviewDto,
  ) {
    return this.qualificationPreviewService.update(+id, qualificationPreviewDto);
  }
  @ApiTags('QualificationPreview')
  @Delete('qualification_preview/:id')
  removeQualificationPreview(@Param('id') id: string) {
    return this.qualificationPreviewService.remove(+id);
  }
  @ApiTags('AboutFeContainer')
  @Post('about_fe_container/:settingid')
  createAboutFeContainer(
    @Body() aboutFeContainerDto: AboutFeContainerDto,
    @Param('settingid') settingid: string,
  ) {
    return this.aboutFeContainerService.create(aboutFeContainerDto, +settingid);
  }
  @ApiTags('AboutFeContainer')
  @Get('about_fe_container')
  findAllAboutFeContainer() {
    return this.aboutFeContainerService.findAll();
  }
  @ApiTags('AboutFeContainer')
  @Get('about_fe_container/:id')
  findOneAboutFeContainer(@Param('id') id: string) {
    return this.aboutFeContainerService.findOne(+id);
  }
  @ApiTags('AboutFeContainer')
  @Patch('about_fe_container/:id')
  updateAboutFeContainer(
    @Param('id') id: string,
    @Body() aboutFeContainerDto: AboutFeContainerDto,
  ) {
    return this.aboutFeContainerService.update(+id, aboutFeContainerDto);
  }
  @ApiTags('AboutFeContainer')
  @Delete('about_fe_container/:id')
  removeAboutFeContainer(@Param('id') id: string) {
    return this.aboutFeContainerService.remove(+id);
  }
}
