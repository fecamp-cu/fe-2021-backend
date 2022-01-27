import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { AboutFeContainerService } from './aboutFeContainer.service';
import { AboutFeContainerDto } from './dto/aboutFeContainer.dto';

@ApiTags('AboutFeContainer')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('about_fe_container')
export class AboutFeContainerController {
  constructor(private readonly aboutFeContainerService: AboutFeContainerService) {}

  @Post(':settingid')
  @CheckPolicies(new ManagePolicyHandler())
  createAboutFeContainer(
    @Body() aboutFeContainerDto: AboutFeContainerDto,
    @Param('settingid') settingid: string,
  ) {
    return this.aboutFeContainerService.create(aboutFeContainerDto, +settingid);
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAllAboutFeContainer() {
    return this.aboutFeContainerService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findOneAboutFeContainer(@Param('id') id: string) {
    return this.aboutFeContainerService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManagePolicyHandler())
  updateAboutFeContainer(
    @Param('id') id: string,
    @Body() aboutFeContainerDto: AboutFeContainerDto,
  ) {
    return this.aboutFeContainerService.update(+id, aboutFeContainerDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  removeAboutFeContainer(@Param('id') id: string) {
    return this.aboutFeContainerService.remove(+id);
  }
}
