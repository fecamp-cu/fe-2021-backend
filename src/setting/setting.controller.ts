import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingDto } from './dto/setting.dto';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}
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
  @Get('active')
  findAllActive() {
    return this.settingService.findAllActive();
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
}
