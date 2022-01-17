import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { SettingDto } from './dto/setting.dto';
import { Setting } from './entities/setting.entity';
import { SponcerContainer } from './entities/sponcer_container.entity';
import { TimelineEvent } from './entities/timeline_event.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    @InjectRepository(TimelineEvent) private timelineEventRepository: Repository<TimelineEvent>,
    @InjectRepository(SponcerContainer)
    private sponcerContainerRepository: Repository<SponcerContainer>,
  ) {}
  async createSetting(settingDto: SettingDto): Promise<SettingDto> {
    const setting: Setting = this.settingRepository.create(settingDto);

    if (settingDto.is_active) {
      setting.is_active = settingDto.is_active;
    } else {
      setting.is_active = false;
    }

    const createdSetting = await this.settingRepository.save(setting);
    return createdSetting;
  }
  async findAll(): Promise<SettingDto[]> {
    return await this.settingRepository.find();
  }

  async findOne(
    id: number,
    relations: string[] = [
      'timeline_events',
      'sponcer_containers',
      'qualification_previews',
      'photo_previews',
      'about_fe_containers',
    ],
  ): Promise<Setting> {
    const setting: Setting = await this.settingRepository.findOne(id, { relations });
    if (!setting) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found setting' });
    }
    await setting.timeline_events.sort((a, b) => {
      const dateA = a.event_date;
      const dateB = b.event_date;
      if (dateA < dateB) {
        return -1;
      }
      if (dateA > dateB) {
        return 1;
      }
      return 0;
    });

    await setting.sponcer_containers.sort((a, b) => {
      return a.order - b.order;
    });

    await setting.qualification_previews.sort((a, b) => {
      return a.order - b.order;
    });
    await setting.photo_previews.sort((a, b) => {
      return a.order - b.order;
    });
    await setting.about_fe_containers.sort((a, b) => {
      return a.order - b.order;
    });

    return setting;
  }

  async update(id: number, settingDto: SettingDto, relations: string[] = []): Promise<SettingDto> {
    const update: UpdateResult = await this.settingRepository.update(id, settingDto);
    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found setting',
      });
    }
    return await this.findOne(id, relations);
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
    return setting;
  }
}
