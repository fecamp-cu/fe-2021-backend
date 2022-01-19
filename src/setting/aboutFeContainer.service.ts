import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { AboutFeContainerDto } from './dto/aboutFeContainer.dto';
import { AboutFeContainer } from './entities/aboutFeContainer.entity';
import { Setting } from './entities/setting.entity';
import { SettingService } from './setting.service';

export class AboutFeContainerService {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    @InjectRepository(AboutFeContainer)
    private aboutFeContainerRepository: Repository<AboutFeContainer>,
    private readonly settingService: SettingService,
  ) {}
  async create(
    aboutFeContainerDto: AboutFeContainerDto,
    settingid: number,
  ): Promise<AboutFeContainerDto> {
    const aboutFeContainer: AboutFeContainer = await this.aboutFeContainerRepository.create(
      aboutFeContainerDto,
    );
    const setting: Setting = await this.settingService.findOne(settingid);
    aboutFeContainer.setting = setting;
    const createdAboutFeContainer = await this.aboutFeContainerRepository.save(aboutFeContainer);

    return new AboutFeContainerDto({
      id: createdAboutFeContainer.id,
      order: createdAboutFeContainer.order,
      text: createdAboutFeContainer.text,
    });
  }

  async findAll(): Promise<AboutFeContainerDto[]> {
    return await this.aboutFeContainerRepository.find();
  }

  async findOne(id: number, relations: string[] = []): Promise<AboutFeContainerDto> {
    const aboutFeContainer: AboutFeContainer = await this.aboutFeContainerRepository.findOne(id, {
      relations,
    });
    if (!AboutFeContainer) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found timeline_event',
      });
    }
    return new AboutFeContainerDto({
      id: aboutFeContainer.id,
      order: aboutFeContainer.order,
      text: aboutFeContainer.text,
    });
  }

  async update(
    id: number,
    aboutFeContainerDto: AboutFeContainerDto,
    relations: string[] = [],
  ): Promise<AboutFeContainerDto> {
    const update: UpdateResult = await this.aboutFeContainerRepository.update(
      id,
      aboutFeContainerDto,
    );
    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found timeline_event',
      });
    }
    return await this.findOne(id, relations);
  }

  async remove(id: number): Promise<AboutFeContainerDto> {
    const deleted: DeleteResult = await this.aboutFeContainerRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found timeline_event',
      });
    }
    return await this.findOne(id);
  }
}
