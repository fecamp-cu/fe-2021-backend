import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { FindUser } from 'src/common/types/user';
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { Profile } from 'src/profile/entities/profile.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

const SALTROUND = 10;
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(
    userDto: UserDto,
    profile?: Profile,
    isEmailVerified: boolean = false,
    const nFindUserByUsername = await this.count({ username: userDto.username });
    if (nFindUserByUsername) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'User already existed',
      });
    }
    const nFindUserByEmail = await this.count({ email: userDto.email });
    if (nFindUserByEmail) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'Email already existed',
      });
    }
    userDto.password = await bcrypt.hash(userDto.password, SALTROUND);

    const user = this.userRepository.create(userDto);

    user.isEmailVerified = isEmailVerified;

    if (profile) {
      user.profile = profile;
    }

    const createdUser = await this.userRepository.save(user);

    return this.rawToDTO(createdUser);
  }

  async findAll(): Promise<UserDto[]> {
    return await this.userRepository.find();
  }

  async Login(loginDto: LoginDto): Promise<UserDto> {
    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .where({ email: loginDto.email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException({
        reason: 'INVALID_INPUT',
        message: 'username or password wrong',
      });
    }

    const passwordcompare = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordcompare) {
      throw new UnauthorizedException({
        reason: 'INVALID_INPUT',
        message: 'username or password wrong',
      });
    }
    return this.rawToDTO(user);
  }

  async findOne(id: number, relations: string[] = []): Promise<User> {
    const user: User = await this.userRepository.findOne(id, { relations });

    if (!user) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found user' });
    }
    return new User({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      tokens: user.tokens,
      role: user.role,
    });
  }

  async update(id: number, userDto: UserDto, relations: string[] = []): Promise<UserDto> {
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, SALTROUND);
    }

    const update: UpdateResult = await this.userRepository.update(id, userDto);

    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'user not found',
      });
    }

    return await this.findOne(id, relations);
  }

  async remove(id: number): Promise<UserDto> {
    const deleted: DeleteResult = await this.userRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'user not found',
      });
    }
    const user = await this.findOne(id);
    return user;
  }

  async findByEmail(email: string, relations: string[] = []): Promise<UserDto | undefined> {
    return await this.userRepository.findOne({ email }, { relations });
  }

  async count(key: FindUser): Promise<number> {
    return await this.userRepository.count(key);
  }

  public async rawToDTO(user: User): Promise<UserDto> {
    const userDto: UserDto = new UserDto({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      role: user.role,
    });
    if (user.tokens) {
      const tokenDto: TokenDto[] = user.tokens.map(
        token =>
          new TokenDto({
            id: token.id,
            serviceType: token.serviceType,
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            expiresDate: token.expiresDate,
          }),
      );
      userDto.tokens = tokenDto;
    }
    if (user.profile) {
      const profileDto: ProfileDto = new ProfileDto({
        id: user.profile.id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        imageUrl: user.profile.imageUrl,
        address: user.profile.address,
        district: user.profile.district,
        subdistrict: user.profile.subdistrict,
        province: user.profile.province,
        postcode: user.profile.postcode,
        tel: user.profile.tel,
        grade: user.profile.grade,
        school: user.profile.school,
      });
      userDto.profile = profileDto;
    }
    return userDto;
  }

  public async serialize(user: User | UserDto): Promise<UserDto> {
    return new UserDto({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      role: user.role,
    });
  }
}
