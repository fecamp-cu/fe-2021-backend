import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SponcerContainerException } from 'src/common/exceptions/sponcerContainer.exception';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { SponcerContainerDto } from './dto/sponcerContainer.dto';
import { Setting } from './entities/setting.entity';
import { SponcerContainer } from './entities/sponcerContainer.entity';
import { SettingService } from './setting.service';

export class SponcerContainerService {
  constructor(
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
    sponcerContainer.setting = setting;
    const createdSponcerContainer = await this.sponcerContainerRepository.save(sponcerContainer);
    return new SponcerContainerDto({
      id: createdSponcerContainer.id,
      order: createdSponcerContainer.order,
      imgUrl: createdSponcerContainer.imgUrl,
    });
  }

  async findAll(): Promise<SponcerContainerDto[]> {
    try {
      return await this.sponcerContainerRepository.find();
    } catch (error) {
      throw new SponcerContainerException(
        'Failed to find all sponcer container',
        error.response.status,
      );
    }
  }

  async findOne(id: number, relations: string[] = []): Promise<SponcerContainerDto> {
    const sponcerContainer: SponcerContainer = await this.sponcerContainerRepository.findOne(id, {
      relations,
    });
    if (!SponcerContainer) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found sponcer_container',
      });
    }
    return new SponcerContainerDto({
      id: sponcerContainer.id,
      order: sponcerContainer.order,
      imgUrl: sponcerContainer.imgUrl,
    });
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
    return await this.findOne(id);
  }
}
