import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { QualificationPreviewDto } from './dto/qualificationPreview.dto';
import { QualificationPreview } from './entities/qualification_preview.entity';
import { Setting } from './entities/setting.entity';
import { SettingService } from './setting.service';

export class QualificationPreviewService {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    @InjectRepository(QualificationPreview)
    private qualificationPreviewRepository: Repository<QualificationPreview>,
    private readonly settingService: SettingService,
  ) {}
  async create(
    qualificationPreviewDto: QualificationPreviewDto,
    settingid: number,
  ): Promise<QualificationPreviewDto> {
    const qualificationPreview: QualificationPreview =
      await this.qualificationPreviewRepository.create(qualificationPreviewDto);
    const setting: Setting = await this.settingService.findOne(settingid);
    qualificationPreview.setting = setting;
    const createdQualificationPreview = await this.qualificationPreviewRepository.save(
      qualificationPreview,
    );
    return new QualificationPreviewDto({
      id: createdQualificationPreview.id,
      order: createdQualificationPreview.order,
      text: createdQualificationPreview.text,
    });
  }

  async findAll(): Promise<QualificationPreviewDto[]> {
    return await this.qualificationPreviewRepository.find();
  }

  async findOne(id: number, relations: string[] = []): Promise<QualificationPreviewDto> {
    const qualificationPreview: QualificationPreview =
      await this.qualificationPreviewRepository.findOne(id, {
        relations,
      });
    if (!QualificationPreview) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found timeline_event',
      });
    }

    return new QualificationPreviewDto({
      id: qualificationPreview.id,
      order: qualificationPreview.order,
      text: qualificationPreview.text,
    });
  }

  async update(
    id: number,
    qualificationPreviewDto: QualificationPreviewDto,
    relations: string[] = [],
  ): Promise<QualificationPreviewDto> {
    const update: UpdateResult = await this.qualificationPreviewRepository.update(
      id,
      qualificationPreviewDto,
    );
    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found timeline_event',
      });
    }
    return await this.findOne(id, relations);
  }

  async remove(id: number): Promise<QualificationPreviewDto> {
    const deleted: DeleteResult = await this.qualificationPreviewRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found timeline_event',
      });
    }
    return await this.findOne(id);
  }
}
