import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PoliciesGuard } from "src/casl/policies.guard";
import { CheckPolicies, ManagePolicyHandler } from "src/casl/policyhandler";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementDto } from "./dto/announcement.dto";

@ApiTags('Announcement')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('setting/about')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post(':settingid')
  @CheckPolicies(new ManagePolicyHandler())
  createAnnouncement(
    @Body() announcementDto: AnnouncementDto,
    @Param('settingid') settingid: string,
  ) {
    return this.announcementService.create(announcementDto, +settingid);
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAllAnnouncement() {
    return this.announcementService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findOneAnnouncement(@Param('id') id: string) {
    return this.announcementService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManagePolicyHandler())
  updateAnnouncement(
    @Param('id') id: string,
    @Body() announcementDto: AnnouncementDto,
  ) {
    return this.announcementService.update(+id, announcementDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  removeAnnouncement(@Param('id') id: string) {
    return this.announcementService.remove(+id);
  }
}
