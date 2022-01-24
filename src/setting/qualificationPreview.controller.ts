import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QualificationPreviewDto } from './dto/qualificationPreview.dto';
import { QualificationPreviewService } from './qualificationPreview.service';

@ApiTags('QualificationPreview')
@Controller('qualification_preview')
export class QualificationPreviewController {
  constructor(private readonly qualificationPreviewService: QualificationPreviewService) {}
  @Post(':settingid')
  createQualificationPreview(
    @Body() qualificationPreviewDto: QualificationPreviewDto,
    @Param('settingid') settingid: string,
  ) {
    return this.qualificationPreviewService.create(qualificationPreviewDto, +settingid);
  }

  @Get()
  findAllQualificationPreview() {
    return this.qualificationPreviewService.findAll();
  }

  @Get(':id')
  findOneQualificationPreview(@Param('id') id: string) {
    return this.qualificationPreviewService.findOne(+id);
  }

  @Patch(':id')
  updateQualificationPreview(
    @Param('id') id: string,
    @Body() qualificationPreviewDto: QualificationPreviewDto,
  ) {
    return this.qualificationPreviewService.update(+id, qualificationPreviewDto);
  }

  @Delete(':id')
  removeQualificationPreview(@Param('id') id: string) {
    return this.qualificationPreviewService.remove(+id);
  }
}
