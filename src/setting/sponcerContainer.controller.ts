import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { SponcerContainerDto } from './dto/sponcerContainer.dto';
import { SponcerContainerService } from './sponcerContainer.service';

@ApiTags('SponcerContainer')
@Controller('sponcer_container')
export class SponcerContainerController {
  constructor(private readonly sponcerContainerService: SponcerContainerService) {}

  @Post(':settingid')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  createSponcerContainer(
    @Body() sponcerContainerDto: SponcerContainerDto,
    @Param('settingid') settingid: string,
  ) {
    return this.sponcerContainerService.create(sponcerContainerDto, +settingid);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  findAllSponcerContainer() {
    return this.sponcerContainerService.findAll();
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  findOneSponcerContainer(@Param('id') id: string) {
    return this.sponcerContainerService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  updateSponcerContainer(
    @Param('id') id: string,
    @Body() sponcerContainerDto: SponcerContainerDto,
  ) {
    return this.sponcerContainerService.update(+id, sponcerContainerDto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  removeSponcerContainer(@Param('id') id: string) {
    return this.sponcerContainerService.remove(+id);
  }
}
