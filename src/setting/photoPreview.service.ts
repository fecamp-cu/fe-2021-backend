import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingException } from 'src/common/exceptions/settting.exception';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PhotoPreviewDto } from './dto/photoPreview.dto';
import { PhotoPreview } from './entities/photoPreview.entity';
import { Setting } from './entities/setting.entity';
import { SettingService } from './setting.service';

export class PhotoPreviewService {
  constructor(
    @InjectRepository(PhotoPreview)
    private photoPreviewRepository: Repository<PhotoPreview>,
    private readonly settingService: SettingService,
  ) {}
  async create(photoPreviewDto: PhotoPreviewDto, settingid: number): Promise<PhotoPreviewDto> {
    const photoPreview: PhotoPreview = await this.photoPreviewRepository.create(photoPreviewDto);
    const setting: Setting = await this.settingService.findOne(settingid);
    photoPreview.setting = setting;
    const createdPhotoPreview = await this.photoPreviewRepository.save(photoPreview);
    return new PhotoPreviewDto({
      id: createdPhotoPreview.id,
      order: createdPhotoPreview.order,
      imgUrl: createdPhotoPreview.imgUrl,
    });
  }

  async findAll(): Promise<PhotoPreviewDto[]> {
    try {
      return await this.photoPreviewRepository.find();
    } catch (error) {
      throw new SettingException('Failed to find all photo preview', error.response.status);
    }
  }

  async findOne(id: number, relations: string[] = []): Promise<PhotoPreviewDto> {
    const photoPreview: PhotoPreview = await this.photoPreviewRepository.findOne(id, {
      relations,
    });
    if (!PhotoPreview) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found preview photo',
      });
    }

    return new PhotoPreviewDto({
      id: photoPreview.id,
      order: photoPreview.order,
      imgUrl: photoPreview.imgUrl,
    });
  }

  async update(
    id: number,
    photoPreviewDto: PhotoPreviewDto,
    relations: string[] = [],
  ): Promise<PhotoPreviewDto> {
    const update: UpdateResult = await this.photoPreviewRepository.update(id, photoPreviewDto);
    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found preview photo',
      });
    }
    return await this.findOne(id, relations);
  }

  async remove(id: number): Promise<PhotoPreviewDto> {
    const deleted: DeleteResult = await this.photoPreviewRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found preview photo',
      });
    }
    return await this.findOne(id);
  }
}
