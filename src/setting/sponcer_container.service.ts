import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { SponcerContainerDto } from './dto/sponcer_container.dto';
import { Setting } from './entities/setting.entity';
import { SponcerContainer } from './entities/sponcer_container.entity';
import { SettingService } from './setting.service';

@Injectable()
export class SponcerContainerService {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    @InjectRepository(SponcerContainer)
    private sponcerContainerRepository: Repository<SponcerContainer>,
    private readonly settingService: SettingService,
  ) {}
  async create(
    sponcerContainerDto: SponcerContainerDto,
    settingid: number,
  ): Promise<SponcerContainerDto> {
    const sponcerContainer: SponcerContainer = await this.sponcerContainerRepository.create(
      sponcerContainerDto,
    );
    const setting: Setting = await this.settingService.findOne(settingid);
    sponcerContainer.setting =  setting;
    const createdSponcerContainer = await this.sponcerContainerRepository.save(sponcerContainer);
    return createdSponcerContainer;
  }

  async findAll(): Promise<SponcerContainerDto[]> {
    return await this.sponcerContainerRepository.find();
  }

  async findOne(id: number, relations: string[] = []): Promise<SponcerContainer> {
    const sponcerContainer: SponcerContainer = await this.sponcerContainerRepository.findOne(id, {
      relations,
    });
    if (!SponcerContainer) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found sponcer_container',
      });
    }
    return sponcerContainer;
  }

  async update(
    id: number,
    sponcerContainerDto: SponcerContainerDto,
    relations: string[] = [],
  ): Promise<SponcerContainerDto> {
    const update: UpdateResult = await this.sponcerContainerRepository.update(
      id,
      sponcerContainerDto,
    );
    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found sponcer_container',
      });
    }
    return await this.findOne(id, relations);
  }

  async remove(id: number): Promise<SponcerContainerDto> {
    const deleted: DeleteResult = await this.sponcerContainerRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'Not found sponcer_container',
      });
    }
    const sponcerContainer = await this.findOne(id);
    return sponcerContainer;
  }
}
