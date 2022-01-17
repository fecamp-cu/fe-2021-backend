import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PhotoPreviewDto } from './dto/photo_preview.dto';
import { PhotoPreview } from './entities/photo_preview.entity';
import { Setting } from './entities/setting.entity';
import { SettingService } from './setting.service';

@Injectable()
export class PhotoPreviewService {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    @InjectRepository(PhotoPreview)
    private photoPreviewRepository: Repository<PhotoPreview>,
    private readonly settingService: SettingService,
  ) {}
  async create(photoPreviewDto: PhotoPreviewDto, settingid: number): Promise<PhotoPreviewDto> {
    const photoPreview: PhotoPreview = await this.photoPreviewRepository.create(photoPreviewDto);
    const setting: Setting = await this.settingService.findOne(settingid);
    photoPreview.setting = setting;
    const createdPhotoPreview = await this.photoPreviewRepository.save(photoPreview);
    return createdPhotoPreview;
  }

  async findAll(): Promise<PhotoPreviewDto[]> {
    return await this.photoPreviewRepository.find();
  }

  async findOne(id: number, relations: string[] = []): Promise<PhotoPreview> {
    const photoPreview: PhotoPreview = await this.photoPreviewRepository.findOne(id, {
      relations,
    });
    if (!PhotoPreview) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found sponcer_container',
      });
    }
    return photoPreview;
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
        message: 'Not found sponcer_container',
      });
    }
    return await this.findOne(id, relations);
  }

  async remove(id: number): Promise<PhotoPreviewDto> {
    const deleted: DeleteResult = await this.photoPreviewRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found sponcer_container',
      });
    }
    const photoPreview = await this.findOne(id);
    return photoPreview;
  }
}
