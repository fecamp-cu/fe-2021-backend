import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PhotoPreviewDto } from './dto/photoPreview.dto';
import { PhotoPreviewService } from './photoPreview.service';

@ApiTags('PhotoPreview')
@Controller('photo_preview')
export class PhotoPreviewController {
  constructor(private readonly photoPreviewService: PhotoPreviewService) {}
  @Post(':settingid')
  createPhotoPreview(
    @Body() photoPreviewDto: PhotoPreviewDto,
    @Param('settingid') settingid: string,
  ) {
    return this.photoPreviewService.create(photoPreviewDto, +settingid);
  }

  @Get()
  findAllPhotoPreview() {
    return this.photoPreviewService.findAll();
  }

  @Get(':id')
  findOnePhotoPreview(@Param('id') id: string) {
    return this.photoPreviewService.findOne(+id);
  }

  @Patch(':id')
  updatePhotoPreview(@Param('id') id: string, @Body() photoPreviewDto: PhotoPreviewDto) {
    return this.photoPreviewService.update(+id, photoPreviewDto);
  }

  @Delete(':id')
  removePhotoPreview(@Param('id') id: string) {
    return this.photoPreviewService.remove(+id);
  }
}
