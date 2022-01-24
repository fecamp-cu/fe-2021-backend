import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { SettingDto } from './dto/setting.dto';
import { Setting } from './entities/setting.entity';

export class SettingService {
  constructor(@InjectRepository(Setting) private settingRepository: Repository<Setting>) {}
  async createSetting(settingDto: SettingDto): Promise<SettingDto> {
    const setting: Setting = this.settingRepository.create(settingDto);

    setting.isActive = false;

    const createdSetting = await this.settingRepository.save(setting);
    return new SettingDto({
      id: createdSetting.id,
      title: createdSetting.title,
      youtubeUrl: createdSetting.youtubeUrl,
      registerFormUrl: createdSetting.registerFormUrl,
      isActive: createdSetting.isActive,
    });
  }
  async findAll(): Promise<SettingDto[]> {
    return await this.settingRepository.find();
  }
  async findAllActive(): Promise<SettingDto[]> {
    return await this.settingRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Setting> {
    const setting: Setting = await this.settingRepository
      .createQueryBuilder('setting')
      .where('setting.id = :id', { id: id })
      .leftJoinAndSelect('setting.timelineEvents', 'timeline_event')
      .leftJoinAndSelect('setting.photoPreviews', 'photo_preview')
      .leftJoinAndSelect('setting.sponcerContainers', 'sponcer_container')
      .leftJoinAndSelect('setting.qualificationPreviews', 'qualification_preview')
      .leftJoinAndSelect('setting.aboutFeContainers', 'about_fe_container')
      .orderBy('event_date', 'ASC')
      .addOrderBy('"photo_preview"."order"', 'ASC')
      .addOrderBy('"sponcer_container"."order"', 'ASC')
      .addOrderBy('"qualification_preview"."order"', 'ASC')
      .addOrderBy('"about_fe_container"."order"', 'ASC')
      .cache(true)
      .getOne();
    if (!setting) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found setting' });
    }
    return setting;
  }

  async update(id: number, settingDto: SettingDto): Promise<SettingDto> {
    const update: UpdateResult = await this.settingRepository.update(id, settingDto);
    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found setting',
      });
    }
    const setting = await this.findOne(id);
    return new SettingDto({
      id: setting.id,
      title: setting.title,
      youtubeUrl: setting.youtubeUrl,
      registerFormUrl: setting.registerFormUrl,
      isActive: setting.isActive,
    });
  }
  async activate(id: number): Promise<SettingDto> {
    const setting: Setting = await this.findOne(id);
    setting.isActive = true;
    const createdSetting = await this.settingRepository.save(setting);
    return new SettingDto({
      id: createdSetting.id,
      title: createdSetting.title,
      youtubeUrl: createdSetting.youtubeUrl,
      registerFormUrl: createdSetting.registerFormUrl,
      isActive: createdSetting.isActive,
    });
  }

  async remove(id: number): Promise<SettingDto> {
    const deleted: DeleteResult = await this.settingRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found setting',
      });
    }
    const setting = await this.findOne(id);
    return new SettingDto({
      id: setting.id,
      title: setting.title,
      youtubeUrl: setting.youtubeUrl,
      registerFormUrl: setting.registerFormUrl,
      isActive: setting.isActive,
    });
  }
}
