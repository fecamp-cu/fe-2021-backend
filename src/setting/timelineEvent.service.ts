import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingException } from 'src/common/exceptions/settting.exception';
import { Repository } from 'typeorm';
import { TimelineEventDto } from './dto/timelineEvent.dto';
import { Setting } from './entities/setting.entity';
import { TimelineEvent } from './entities/timelineEvent.entity';
import { SettingService } from './setting.service';

export class TimelineEventService {
  constructor(
    @InjectRepository(TimelineEvent) private timelineEventRepository: Repository<TimelineEvent>,
    private readonly settingService: SettingService,
  ) {}
  async create(timelineEventDto: TimelineEventDto, settingid: number): Promise<TimelineEventDto> {
    const timelineEvent: TimelineEvent = await this.timelineEventRepository.create(
      timelineEventDto,
    );
    const setting: Setting = await this.settingService.findOne(settingid);
    timelineEvent.setting = setting;
    const createdTimelineEvent = await this.timelineEventRepository.save(timelineEvent);
    return new TimelineEventDto({
      id: createdTimelineEvent.id,
      text: createdTimelineEvent.text,
      eventStartDate: createdTimelineEvent.eventStartDate,
      eventEndDate: createdTimelineEvent.eventEndDate,
    });
  }

  async findAll(): Promise<TimelineEventDto[]> {
    try {
      return await this.timelineEventRepository.find();
    } catch (error) {
      throw new SettingException('Failed to find all timeline event', error.response.status);
    }
  }

  async findOne(id: number, relations: string[] = []): Promise<TimelineEventDto> {
    const timelineEvent: TimelineEvent = await this.timelineEventRepository.findOne(id, {
      relations,
    });
    if (!timelineEvent) {
      throw new NotFoundException({
        StatusCode: 404,
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found timeline_event',
      });
    }
    return new TimelineEventDto({
      id: timelineEvent.id,
      text: timelineEvent.text,
      eventStartDate: timelineEvent.eventStartDate,
      eventEndDate: timelineEvent.eventEndDate,
    });
  }

  async update(
    id: number,
    timelineEventDto: TimelineEventDto,
    relations: string[] = [],
  ): Promise<TimelineEventDto> {
    const timelineEvent: TimelineEventDto = await this.findOne(id, relations);
    await this.timelineEventRepository.update(id, timelineEventDto);

    return timelineEvent;
  }

  async remove(id: number): Promise<TimelineEventDto> {
    const timelineEvent: TimelineEventDto = await this.findOne(id);
    await this.timelineEventRepository.softDelete(id);

    return timelineEvent;
  }
}
