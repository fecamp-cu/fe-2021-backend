import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AboutFeContainerService } from './aboutFeContainer.service';
import { AboutFeContainerDto } from './dto/aboutFeContainer.dto';

@ApiTags('AboutFeContainer')
@Controller('about_fe_container')
export class AboutFeContainerController {
  constructor(private readonly aboutFeContainerService: AboutFeContainerService) {}
  @Post(':settingid')
  createAboutFeContainer(
    @Body() aboutFeContainerDto: AboutFeContainerDto,
    @Param('settingid') settingid: string,
  ) {
    return this.aboutFeContainerService.create(aboutFeContainerDto, +settingid);
  }

  @Get()
  findAllAboutFeContainer() {
    return this.aboutFeContainerService.findAll();
  }

  @Get(':id')
  findOneAboutFeContainer(@Param('id') id: string) {
    return this.aboutFeContainerService.findOne(+id);
  }

  @Patch(':id')
  updateAboutFeContainer(
    @Param('id') id: string,
    @Body() aboutFeContainerDto: AboutFeContainerDto,
  ) {
    return this.aboutFeContainerService.update(+id, aboutFeContainerDto);
  }

  @Delete(':id')
  removeAboutFeContainer(@Param('id') id: string) {
    return this.aboutFeContainerService.remove(+id);
  }
}
