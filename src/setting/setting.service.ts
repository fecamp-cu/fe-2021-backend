import { ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import * as moment from 'moment';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { SettingException } from 'src/common/exceptions/settting.exception';
import { Youtube, YoutubeVideo } from 'src/common/interface/youtube';
import { YoutubeService } from 'src/third-party/youtube/youtube.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SettingDto } from './dto/setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';

export class SettingService {
  constructor(
    @InjectRepository(Setting) private settingRepository: Repository<Setting>,
    private readonly youtubeService: YoutubeService,
  ) {}

  async createSetting(settingDto: CreateSettingDto, user: User): Promise<Setting> {
    const setting: Setting = this.settingRepository.create(settingDto);
    setting.user = user;
    setting.isActive = false;

    const createdSetting = await this.settingRepository.save(setting);
    return new Setting({
      id: createdSetting.id,
      title: createdSetting.title,
      coverImgUrl: createdSetting.coverImgUrl,
      youtubeUrl: createdSetting.youtubeUrl,
      buttonText: createdSetting.buttonText,
      registerFormUrl: createdSetting.registerFormUrl,
      isActive: createdSetting.isActive,
    });
  }

  async findAll(): Promise<Setting[]> {
    try {
      return await this.settingRepository.find();
    } catch (err) {
      throw new SettingException('Setting Query Error', err.response);
    }
  }

  async findWithPaginate(options: IPaginationOptions): Promise<Pagination<Setting>> {
    const query = this.settingRepository.createQueryBuilder('setting');

    return paginate<Setting>(query, options);
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
        .leftJoinAndSelect('setting.announcements', 'announcement')
        .orderBy('event_start_date', 'ASC')
        .addOrderBy('"photo_preview"."order"', 'ASC')
        .addOrderBy('"sponcer_container"."order"', 'ASC')
        .addOrderBy('"qualification_preview"."order"', 'ASC')
        .addOrderBy('"about_fe_container"."order"', 'ASC')
        .addOrderBy('"announcement"."order"', 'ASC')
        .cache(true)
        .getOne();

      return this.rawToDto(setting, true);
    } catch (error) {
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
        .leftJoinAndSelect('setting.announcements', 'announcement')
        .orderBy('event_start_date', 'ASC')
        .addOrderBy('"photo_preview"."order"', 'ASC')
        .addOrderBy('"sponcer_container"."order"', 'ASC')
        .addOrderBy('"qualification_preview"."order"', 'ASC')
        .addOrderBy('"about_fe_container"."order"', 'ASC')
        .addOrderBy('"announcement"."order"', 'ASC')
        .cache(true)
        .getOne();

      return setting;
    } catch (err) {
      throw new SettingException('Setting Query Error', err.response);
    }
  }

  async update(id: number, settingDto: UpdateSettingDto): Promise<Setting> {
    const setting = await this.findOne(id);
    await this.settingRepository.update(id, settingDto);

    return setting;
  }

  async remove(id: number): Promise<Setting> {
    const setting = await this.findOne(id);
    await this.settingRepository.softDelete(id);

    return setting;
  }

  async rawToDto(setting: Setting, withYoutubeContent: boolean): Promise<SettingDto> {
    let youtube: Youtube = { url: setting.youtubeUrl };

    if (withYoutubeContent) {
      const youtubeId = setting.youtubeUrl.split('?')[1].split('=')[1];
      let youtubeVideo: YoutubeVideo;

      try {
        const res = await this.youtubeService.getVideo(youtubeId);
        youtubeVideo = res.data;
      } catch (err) {
        const error: AxiosError = err;
        console.error(error.response.data);
        throw new ServiceUnavailableException({
          reason: 'YOUTUBE_ERROR',
          message: error.response.data,
        });
      }

      const youtubeItem = youtubeVideo.items[0];
      const contentDuration = moment.duration(youtubeItem.contentDetails.duration).asMilliseconds();
      youtube = {
        url: setting.youtubeUrl,
        title: youtubeItem.snippet.title,
        thumbnail: youtubeItem.snippet.thumbnails.high.url,
        duration: moment.utc(contentDuration).format('HH:mm:ss'),
        likes: youtubeItem.statistics.likeCount,
        views: youtubeItem.statistics.viewCount,
        publishDate: youtubeItem.snippet.publishedAt,
      };
    }

    return new SettingDto({
      id: setting.id,
      title: setting.title,
      coverImgUrl: setting.coverImgUrl,
      youtube: youtube,
      buttonText: setting.buttonText,
      registerFormUrl: setting.registerFormUrl,
      isActive: setting.isActive,
      publishDate: setting.publishDate,
      endDate: setting.endDate,
    });
  }
}
