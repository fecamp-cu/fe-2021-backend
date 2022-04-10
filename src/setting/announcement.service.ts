import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SettingException } from "src/common/exceptions/settting.exception";
import { Repository } from "typeorm";
import { AnnouncementDto } from "./dto/announcement.dto";
import { Announcement } from "./entities/announcement.entity";
import { Setting } from "./entities/setting.entity";
import { SettingService } from "./setting.service";

export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
    private readonly settingService: SettingService,
  ) {}
  async create(
    announcementDto: AnnouncementDto,
    settingid: number,
  ): Promise<AnnouncementDto> {
    const announcement: Announcement = await this.announcementRepository.create(
        announcementDto,
    );
    const setting: Setting = await this.settingService.findOne(settingid);
    announcement.setting = setting;
    const createdAnnouncement = await this.announcementRepository.save(announcement);

    return new AnnouncementDto({
      id: createdAnnouncement.id,
      dateStart: createdAnnouncement.dateStart,
      dateEnd: createdAnnouncement.dateEnd,
      header: createdAnnouncement.header,
      description: createdAnnouncement.description,
    });
  }

  async findAll(): Promise<AnnouncementDto[]> {
    try {
      return  await this.announcementRepository.find();
    } catch (error) {
      throw new SettingException('Failed to find all about fe container', error.response.status);
    }
  }

  async findOne(id: number, relations: string[] = []): Promise<AnnouncementDto> {
    const announcement: Announcement = await this.announcementRepository.findOne(id, {
      relations,
    });
    if (!Announcement) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found announce',
      });
    }
    return new AnnouncementDto({
      id: announcement.id,
      dateStart: announcement.dateStart,
      dateEnd: announcement.dateEnd,
      header: announcement.header,
      description: announcement.description,
    });
  }

  async update(
    id: number,
    announcementDto: AnnouncementDto,
    relations: string[] = [],
  ): Promise<AnnouncementDto> {
    const announcement: AnnouncementDto = await this.findOne(id, relations);
    await this.announcementRepository.update(id, announcementDto);

    return announcement;
  }

  async remove(id: number): Promise<AnnouncementDto> {
    const announcement: AnnouncementDto = await this.findOne(id);
    await this.announcementRepository.softDelete(id);

    return announcement;
  }
}

