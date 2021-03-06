import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingException } from 'src/common/exceptions/settting.exception';
import { Repository } from 'typeorm';
import { QualificationPreviewDto } from './dto/qualificationPreview.dto';
import { QualificationPreview } from './entities/qualificationPreview.entity';
import { Setting } from './entities/setting.entity';
import { SettingService } from './setting.service';

export class QualificationPreviewService {
  constructor(
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
    try {
      return await this.qualificationPreviewRepository.find();
    } catch (error) {
      throw new SettingException('Failed to find all qualification preview', error.response.status);
    }
  }

  async findOne(id: number, relations: string[] = []): Promise<QualificationPreviewDto> {
    const qualificationPreview: QualificationPreview =
      await this.qualificationPreviewRepository.findOne(id, {
        relations,
      });
    if (!QualificationPreview) {
      throw new NotFoundException({
        StatusCode: 404,
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
    const qualificationPreview: QualificationPreviewDto = await this.findOne(id, relations);
    await this.qualificationPreviewRepository.update(id, qualificationPreviewDto);

    return qualificationPreview;
  }

  async remove(id: number): Promise<QualificationPreviewDto> {
    const qualificationPreview: QualificationPreviewDto = await this.findOne(id);
    await this.qualificationPreviewRepository.softDelete(id);

    return qualificationPreview;
  }
}
