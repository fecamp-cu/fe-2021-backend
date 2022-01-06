import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleCloudStorage } from 'src/common/google-cloud/google-storage';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  // create(createProfileDto: CreateProfileDto) {
  //   return 'This action adds a new profile';
  // }
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

  async uploadImage(uid: number, avatar: Buffer): Promise<string> {
    const imageStorage = new GoogleCloudStorage(this.configService);
    const imageURL = await imageStorage.uploadImage(uid, avatar);
    const user = await this.userRepository.findOne(uid, { relations: ['profile'] });
    user.profile.imageUrl = imageURL;
    await this.userRepository.save(user);
    return imageURL;
  }
}
