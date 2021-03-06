import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingException } from 'src/common/exceptions/settting.exception';
import { Repository } from 'typeorm';
import { AboutFeContainerDto } from './dto/aboutFeContainer.dto';
import { AboutFeContainer } from './entities/aboutFeContainer.entity';
import { Setting } from './entities/setting.entity';
import { SettingService } from './setting.service';

export class AboutFeContainerService {
  constructor(
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
    try {
      return await this.aboutFeContainerRepository.find();
    } catch (error) {
      throw new SettingException('Failed to find all about fe container', error.response.status);
    }
  }

  async findOne(id: number, relations: string[] = []): Promise<AboutFeContainerDto> {
    const aboutFeContainer: AboutFeContainer = await this.aboutFeContainerRepository.findOne(id, {
      relations,
    });
    if (!AboutFeContainer) {
      throw new NotFoundException({
        StatusCode: 404,
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found about fe container',
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
    const aboutFeContainer: AboutFeContainerDto = await this.findOne(id, relations);
    await this.aboutFeContainerRepository.update(id, aboutFeContainerDto);

    return aboutFeContainer;
  }

  async remove(id: number): Promise<AboutFeContainerDto> {
    const aboutFeContainer: AboutFeContainerDto = await this.findOne(id);
    await this.aboutFeContainerRepository.softDelete(id);

    return aboutFeContainer;
  }
}
