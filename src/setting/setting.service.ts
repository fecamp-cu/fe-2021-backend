import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingException } from 'src/common/exceptions/settting.exception';
import { Project } from 'src/project/entities/project.entity';
import { Repository } from 'typeorm';
import { SettingDto } from './dto/setting.dto';
import { Setting } from './entities/setting.entity';

export class SettingService {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async createSetting(settingDto: SettingDto, projectid: number): Promise<SettingDto> {
    const setting: Setting = this.settingRepository.create(settingDto);
    const project: Project = await this.projectRepository.findOne(projectid);
    setting.project = project;

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
    try {
      return await this.settingRepository.find();
    } catch (err) {
      throw new SettingException('Setting Query Error', err.response);
    }
  }
  async findAllActive(): Promise<SettingDto> {
    try {
      const setting: Setting = await this.settingRepository
        .createQueryBuilder('setting')
        .where('setting.is_active = :isActive', { isActive: true })
        .leftJoinAndSelect('setting.timelineEvents', 'timeline_event')
        .leftJoinAndSelect('setting.photoPreviews', 'photo_preview')
        .leftJoinAndSelect('setting.sponcerContainers', 'sponcer_container')
        .leftJoinAndSelect('setting.qualificationPreviews', 'qualification_preview')
        .leftJoinAndSelect('setting.aboutFeContainers', 'about_fe_container')
        .orderBy('event_start_date', 'ASC')
        .addOrderBy('"photo_preview"."order"', 'ASC')
        .addOrderBy('"sponcer_container"."order"', 'ASC')
        .addOrderBy('"qualification_preview"."order"', 'ASC')
        .addOrderBy('"about_fe_container"."order"', 'ASC')
        .cache(true)
        .getOne();

      if (!setting) {
        throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found setting' });
      }

      return setting as SettingDto;
    } catch (error) {
      console.error(error);
      throw new SettingException('Failed to find activated setting', error.response);
    }
  }

  async findOne(id: number): Promise<Setting> {
    try {
      const setting: Setting = await this.settingRepository
        .createQueryBuilder('setting')
        .where('setting.id = :id', { id: id })
        .leftJoinAndSelect('setting.timelineEvents', 'timeline_event')
        .leftJoinAndSelect('setting.photoPreviews', 'photo_preview')
        .leftJoinAndSelect('setting.sponcerContainers', 'sponcer_container')
        .leftJoinAndSelect('setting.qualificationPreviews', 'qualification_preview')
        .leftJoinAndSelect('setting.aboutFeContainers', 'about_fe_container')
        .orderBy('event_start_date', 'ASC')
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
    } catch (err) {
      throw new SettingException('Setting Query Error', err.response);
    }
  }

  async update(id: number, settingDto: SettingDto): Promise<SettingDto> {
    const setting = await this.findOne(id);
    await this.settingRepository.update(id, settingDto);

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
    const setting = await this.findOne(id);
    await this.settingRepository.softDelete(id);

    return new SettingDto({
      id: setting.id,
      title: setting.title,
      youtubeUrl: setting.youtubeUrl,
      registerFormUrl: setting.registerFormUrl,
      isActive: setting.isActive,
    });
  }
}
