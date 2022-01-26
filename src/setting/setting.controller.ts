import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { SettingDto } from './dto/setting.dto';
import { SettingService } from './setting.service';

@ApiTags('Setting')
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  @CheckPolicies(new ManagePolicyHandler())
  create(@Body() settingDto: SettingDto) {
    return this.settingService.createSetting(settingDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.settingService.findAll();
  }

  @Get('active')
  @Public()
  findAllActive() {
    return this.settingService.findAllActive();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.settingService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManagePolicyHandler())
  update(@Param('id') id: string, @Body() settingDto: SettingDto) {
    return this.settingService.update(+id, settingDto);
  }

  @Patch(':id/activate')
  @CheckPolicies(new ManagePolicyHandler())
  activate(@Param('id') id: string) {
    return this.settingService.activate(+id);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }
}
