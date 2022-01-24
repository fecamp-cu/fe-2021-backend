import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SponcerContainerDto } from './dto/sponcerContainer.dto';
import { SponcerContainerService } from './sponcerContainer.service';

@ApiTags('SponcerContainer')
@Controller('sponcer_container')
export class SponcerContainerController {
  constructor(private readonly sponcerContainerService: SponcerContainerService) {}
  @Post(':settingid')
  createSponcerContainer(
    @Body() sponcerContainerDto: SponcerContainerDto,
    @Param('settingid') settingid: string,
  ) {
    return this.sponcerContainerService.create(sponcerContainerDto, +settingid);
  }

  @Get()
  findAllSponcerContainer() {
    return this.sponcerContainerService.findAll();
  }

  @Get(':id')
  findOneSponcerContainer(@Param('id') id: string) {
    return this.sponcerContainerService.findOne(+id);
  }

  @Patch(':id')
  updateSponcerContainer(
    @Param('id') id: string,
    @Body() sponcerContainerDto: SponcerContainerDto,
  ) {
    return this.sponcerContainerService.update(+id, sponcerContainerDto);
  }

  @Delete(':id')
  removeSponcerContainer(@Param('id') id: string) {
    return this.sponcerContainerService.remove(+id);
  }
}
