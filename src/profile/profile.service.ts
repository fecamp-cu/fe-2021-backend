import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleCloudStorage } from 'src/third-party/google-cloud/google-storage.service';
import { UserDto } from 'src/user/dto/user.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}
  async create(profileDto: ProfileDto): Promise<Profile> {
    const profile: Profile = await this.profileRepository.create(profileDto);
    return await this.profileRepository.save(profile);
  }

  async findAll(): Promise<ProfileDto[]> {
    return await this.profileRepository.find();
  }
  async findOne(id: number): Promise<ProfileDto> {
    const profile: Profile = await this.profileRepository.findOne(id);

    if (!profile) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found profile' });
    }
    return new ProfileDto({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      imageUrl: profile.imageUrl,
      tel: profile.tel,
      grade: profile.grade,
      school: profile.school,
      address: profile.address,
      subdistrict: profile.subdistrict,
      district: profile.district,
      province: profile.province,
      postcode: profile.postcode,
    });
  }

  async update(id: number, profileDto: ProfileDto): Promise<ProfileDto> {
    const update: UpdateResult = await this.profileRepository.update(id, profileDto);

    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'profile not found',
      });
    }

    const profile: ProfileDto = await this.findOne(id);
    return new ProfileDto({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      imageUrl: profile.imageUrl,
      tel: profile.tel,
      grade: profile.grade,
      school: profile.school,
      address: profile.address,
      subdistrict: profile.subdistrict,
      district: profile.district,
      province: profile.province,
      postcode: profile.postcode,
    });
  }
  async remove(id: number): Promise<ProfileDto> {
    const deleted: DeleteResult = await this.profileRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'profile not found',
      });
    }
    const profile = await this.findOne(id);
    return new ProfileDto({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      imageUrl: profile.imageUrl,
      tel: profile.tel,
      grade: profile.grade,
      school: profile.school,
      address: profile.address,
      subdistrict: profile.subdistrict,
      district: profile.district,
      province: profile.province,
      postcode: profile.postcode,
    });
  }

  async uploadImage(user: UserDto, avatar: Buffer): Promise<Profile> {
    const imageStorage = new GoogleCloudStorage(this.configService);
    const imageURL = await imageStorage.uploadImage(
      user.profile.firstName,
      user.profile.lastName,
      avatar,
    );
    const profile = user.profile;
    profile.imageUrl = imageURL;
    return await this.profileRepository.save(profile);
  }
}
