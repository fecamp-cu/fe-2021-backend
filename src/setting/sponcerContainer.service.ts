import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingException } from 'src/common/exceptions/settting.exception';
import { Repository } from 'typeorm';
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
      throw new SettingException('Failed to find all sponcer container', error.response.status);
    }
  }

  async findOne(id: number, relations: string[] = []): Promise<SponcerContainerDto> {
    const sponcerContainer: SponcerContainer = await this.sponcerContainerRepository.findOne(id, {
      relations,
    });
    if (!SponcerContainer) {
      throw new NotFoundException({
        StatusCode: 404,
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
    const sponsorContainer: SponcerContainerDto = await this.findOne(id, relations);
    await this.sponcerContainerRepository.update(id, sponcerContainerDto);

    return sponsorContainer;
  }

  async remove(id: number): Promise<SponcerContainerDto> {
    const sponsorContainer: SponcerContainerDto = await this.findOne(id);
    await this.sponcerContainerRepository.softDelete(id);

    return sponsorContainer;
  }
}
