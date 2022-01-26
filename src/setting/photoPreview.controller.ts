import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { PhotoPreviewDto } from './dto/photoPreview.dto';
import { PhotoPreviewService } from './photoPreview.service';

@ApiTags('PhotoPreview')
@Controller('photo_preview')
export class PhotoPreviewController {
  constructor(private readonly photoPreviewService: PhotoPreviewService) {}

  @Post(':settingid')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  createPhotoPreview(
    @Body() photoPreviewDto: PhotoPreviewDto,
    @Param('settingid') settingid: string,
  ) {
    return this.photoPreviewService.create(photoPreviewDto, +settingid);
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  findAllPhotoPreview() {
    return this.photoPreviewService.findAll();
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  findOnePhotoPreview(@Param('id') id: string) {
    return this.photoPreviewService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  updatePhotoPreview(@Param('id') id: string, @Body() photoPreviewDto: PhotoPreviewDto) {
    return this.photoPreviewService.update(+id, photoPreviewDto);
  }

  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  removePhotoPreview(@Param('id') id: string) {
    return this.photoPreviewService.remove(+id);
  }
}
