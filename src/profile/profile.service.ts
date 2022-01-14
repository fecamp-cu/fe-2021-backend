import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleCloudStorage } from 'src/third-party/google-cloud/google-storage.service';
import { UserDto } from 'src/user/dto/user.dto';
import { Repository } from 'typeorm';
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

  // findAll() {
  //   return `This action returns all profile`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} profile`;
  // }
  // update(id: number, updateProfileDto: UpdateProfileDto) {
  //   return `This action updates a #${id} profile`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} profile`;
  // }

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
