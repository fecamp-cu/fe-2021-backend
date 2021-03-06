import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Public } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { RequestWithUserId } from 'src/common/types/auth';
import { User } from 'src/user/entities/user.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SettingDto } from './dto/setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import { SettingService } from './setting.service';

@ApiTags('Setting')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  @CheckPolicies(new ManagePolicyHandler())
  create(@Body() settingDto: CreateSettingDto, @Req() req: RequestWithUserId): Promise<Setting> {
    return this.settingService.createSetting(settingDto, req.user as User);
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAll(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ): Promise<Pagination<Setting>> {
    return this.settingService.findWithPaginate({ limit, page });
  }

  @Get('active')
  @Public()
  async findAllActive(): Promise<SettingDto> {
    const setting = await this.settingService.findAllActive();
    if (!setting) {
      throw new NotFoundException({
        StatusCode: 404,
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found setting',
      });
    }
    return this.settingService.findAllActive();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  async findOne(@Param('id') id: string): Promise<Setting> {
    const setting = await this.settingService.findOne(+id);
    if (!setting) {
      throw new NotFoundException({
        StatusCode: 404,
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found setting',
      });
    }

    return setting;
  }

  @Patch(':id')
  @CheckPolicies(new ManagePolicyHandler())
  update(@Param('id') id: string, @Body() settingDto: UpdateSettingDto) {
    return this.settingService.update(+id, settingDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }
}
