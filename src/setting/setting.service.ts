import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { SettingDto } from './dto/setting.dto';
import { TimelineEventDto } from './dto/timeline_event.dto';
import { Setting } from './entities/setting.entity';
import { TimelineEvent } from './entities/timeline_event.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    @InjectRepository(TimelineEvent) private timelineEventRepository: Repository<TimelineEvent>,
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
  async findOne(id: number, relations: string[] = []): Promise<Setting> {
    const setting: Setting = await this.settingRepository.findOne(id, { relations });
    if (!setting) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found setting' });
    }
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

  async createTimelineEvent(
    timelineEventDto: TimelineEventDto,
    settingid: number,
  ): Promise<TimelineEventDto> {
    const timelineEvent: TimelineEvent = await this.timelineEventRepository.create(
      timelineEventDto,
    );
    const setting: Setting = await this.findOne(settingid);
    timelineEvent.setting = setting;
    const createdTimelineEvent = await this.timelineEventRepository.save(timelineEvent);
    return createdTimelineEvent;
  }

  async findAllTimelineEvent(): Promise<TimelineEventDto[]> {
    return await this.timelineEventRepository.find();
  }

  async findOneTimelineEvent(id: number, relations: string[] = []): Promise<TimelineEvent> {
    const timelineEvent: TimelineEvent = await this.timelineEventRepository.findOne(id, {
      relations,
    });
    if (!timelineEvent) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found timelineEvent',
      });
    }
    return timelineEvent;
  }

  async updateTimelineEvent(
    id: number,
    timelineEventDto: TimelineEventDto,
    relations: string[] = [],
  ): Promise<TimelineEventDto> {
    const update: UpdateResult = await this.timelineEventRepository.update(id, timelineEventDto);
    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found timelineEvent',
      });
    }
    return await this.findOneTimelineEvent(id, relations);
  }

  async removeTimelineEvent(id: number): Promise<TimelineEventDto> {
    const deleted: DeleteResult = await this.timelineEventRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found timelineEvent',
      });
    }
    const timelineEvent = await this.findOneTimelineEvent(id);
    return timelineEvent;
  }
}
