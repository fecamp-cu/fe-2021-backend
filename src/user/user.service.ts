import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { FindUser } from 'src/common/types/user';
import { Profile } from 'src/profile/entities/profile.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

const SALTROUND = 10;
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(userDto: UserDto, profile?: Profile): Promise<UserDto> {
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

    if (profile) {
      user.profile = profile;
    }

    const createdUser = await this.userRepository.save(user);

    return new UserDto({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      profile,
      role: createdUser.role,
    });
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
    return new UserDto({
      id: user.id,
      username: user.username,
      role: user.role,
    });
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
    const update: UpdateResult = await this.userRepository.update(id, userDto);
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, SALTROUND);
    }

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
}
