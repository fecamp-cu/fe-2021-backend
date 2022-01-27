import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { SettingDto } from './dto/setting.dto';
import { SettingService } from './setting.service';

@ApiTags('Setting')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
// @UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  @CheckPolicies(new ManagePolicyHandler())
  create(@Body() settingDto: SettingDto) {
    return this.settingService.createSetting(settingDto);
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAll() {
    return this.settingService.findAll();
  }

  @Get('active')
  @Public()
  findAllActive() {
    return this.settingService.findAllActive();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
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
