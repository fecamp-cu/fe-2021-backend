import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { QualificationPreviewDto } from './dto/qualificationPreview.dto';
import { QualificationPreviewService } from './qualificationPreview.service';

@ApiTags('QualificationPreview')
@Controller('qualification_preview')
export class QualificationPreviewController {
  constructor(private readonly qualificationPreviewService: QualificationPreviewService) {}

  @Post(':settingid')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  createQualificationPreview(
    @Body() qualificationPreviewDto: QualificationPreviewDto,
    @Param('settingid') settingid: string,
  ) {
    return this.qualificationPreviewService.create(qualificationPreviewDto, +settingid);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  findAllQualificationPreview() {
    return this.qualificationPreviewService.findAll();
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  findOneQualificationPreview(@Param('id') id: string) {
    return this.qualificationPreviewService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  updateQualificationPreview(
    @Param('id') id: string,
    @Body() qualificationPreviewDto: QualificationPreviewDto,
  ) {
    return this.qualificationPreviewService.update(+id, qualificationPreviewDto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  removeQualificationPreview(@Param('id') id: string) {
    return this.qualificationPreviewService.remove(+id);
  }
}
